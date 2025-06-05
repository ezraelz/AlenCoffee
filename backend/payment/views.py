import stripe
import requests
import json
from django.db import transaction
from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Payment
from orders.models import Order, ShippingAddress
from .serializers import PaymentSerializer
from users.models import CustomUser
from django.conf import settings
from .models import Invoice, Payment
from .serializers import InvoiceSerializer
from django.utils import timezone
import uuid
from datetime import datetime
from django.utils.timezone import make_aware
from orders.utils import get_cart_total,generate_invoice_pdf

stripe.api_key = settings.STRIPE_SECRET_KEY


# ----------------------------------------
# Payment Views
# ----------------------------------------

class PaymentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(order__user=request.user).order_by('-created_at')
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class PaymentCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        order_id = request.data.get('order_id')
        payment_method = request.data.get('payment_method')

        if not order_id or not payment_method:
            return Response({'error': 'order_id and payment_method required'}, status=status.HTTP_400_BAD_REQUEST)

        order = get_object_or_404(Order, id=order_id)

        payment, created = Payment.objects.get_or_create(order=order, defaults={
            'payment_method': payment_method,
            'status': 'pending',
            'amount': order.total,
        })

        if not created:
            payment.status = 'pending'
            payment.amount = order.total
            payment.payment_method = payment_method
            payment.save()

        return Response({
            'payment_id': payment.id,
            'status': payment.status,
            'message': 'Payment created/updated successfully'
        }, status=status.HTTP_200_OK)

    def put(self, request, payment_id):
        payment = get_object_or_404(Payment, id=payment_id)
        serializer = PaymentSerializer(payment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------------------------------
# Stripe Checkout & Webhook Views
# ----------------------------------------


class StripeCheckoutView(APIView):
    permission_classes = []

    def post(self, request):
        if not request.session.session_key:
            request.session.create()
        session_key = request.session.session_key

        order = None
        if request.user.is_authenticated:
            order = Order.objects.filter(user=request.user, status='pending').first()
        if not order:
            order = Order.objects.filter(session_key=session_key, status='pending').first()

        if not order:
            return JsonResponse({'error': 'Order not found'}, status=404)

        amount = get_cart_total(request, user=request.user, session_key=session_key)
        if amount <= 0:
            return JsonResponse({'error': 'Invalid amount'}, status=400)

        customer_email = request.data.get('email') or (request.user.email if request.user.is_authenticated else None)

        payment = Payment.objects.filter(order=order).first()

        if payment:
            if payment.status == 'pending' and not payment.transaction_id:
                # Reuse the payment by updating amount and status
                payment.amount = amount
                payment.status = 'pending'
                payment.save()
            else:
                # Payment already processed or not reusable
                return JsonResponse({'error': 'Payment already processed or invalid state'}, status=400)
        else:
            # No payment exists for this order, create a new one
            payment = Payment.objects.create(
                order=order,
                payment_method='stripe',
                status='pending',
                amount=amount,
            )

        try:
            stripe_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {'name': f'Order #{order.id}'},
                        'unit_amount': int(amount * 100),
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f"{settings.FRONTEND_URL}/success",
                cancel_url=f"{settings.FRONTEND_URL}/cancel",
                customer_email=customer_email,
                metadata={
                    'session_key': session_key,
                    'order_id': str(order.id),
                    'payment_id': str(payment.id),
                }
            )
            return JsonResponse({
                'session_id': stripe_session.id,
                'stripe_public_key': settings.STRIPE_PUBLISHABLE_KEY,
                'url': stripe_session.url,
            }, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def stripe_webhook_view(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except Exception as e:
        print(f"Webhook signature error: {e}")
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        metadata = session.get('metadata', {})
        order_id = metadata.get('order_id')
        payment_id = metadata.get('payment_id')
        tx_id = session.get('payment_intent')

        if not order_id or not payment_id or not tx_id:
            print("Missing metadata in Stripe session")
            return HttpResponse(status=400)

        try:
            with transaction.atomic():
                order = Order.objects.select_for_update().get(id=order_id)
                payment = Payment.objects.select_for_update().get(id=payment_id, order=order)

                # Avoid duplicate transaction_id saving
                if payment.transaction_id:
                    print("Payment already completed")
                    return HttpResponse(status=200)

                # Update order & payment statuses
                order.status = 'paid'
                order.save()

                payment.status = 'paid'
                payment.transaction_id = tx_id
                payment.save()

                # Update shipping status if present
                try:
                    shipping_address = order.shipping_address
                    if shipping_address:
                        shipping_address.status = 'delivered'
                        shipping_address.save()
                except ShippingAddress.DoesNotExist:
                    pass

                # Generate invoice PDF (fail gracefully)
                try:
                    generate_invoice_pdf(order)
                except Exception as pdf_error:
                    print(f"❌ Invoice generation failed: {pdf_error}")

                # Update invoice status
                invoice = getattr(order, 'invoice', None)
                if invoice:
                    invoice.status = 'paid'
                    invoice.save()

        except Exception as e:
            print(f"❌ Webhook processing error: {e}")
            return HttpResponse(status=500)

    return HttpResponse(status=200)


# ----------------------------------------
# Generic Payment Handler for other methods (PayPal, Klarna, Swish)
# ----------------------------------------

class BasePaymentView(APIView):
    permission_classes = [AllowAny]
    payment_method = None  # To be set in subclasses

    def post(self, request):
        data = request.data
        transaction_id = data.get('transaction_id')
        email = data.get('email')

        if not transaction_id or not email:
            return Response({'error': 'transaction_id and email required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            order = Order.objects.get(user=user, status='pending')
        except Order.DoesNotExist:
            return Response({'error': 'Order not found or already paid'}, status=status.HTTP_404_NOT_FOUND)

        try:
            payment = Payment.objects.get(order=order, transaction_id=transaction_id)
            return Response({'message': 'Payment already processed'}, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            pass

        with transaction.atomic():
            payment = Payment.objects.create(
                order=order,
                payment_method=self.payment_method,
                status='completed',
                transaction_id=transaction_id,
                amount=order.total,
            )
            order.status = 'paid'
            order.save()

            try:
                shipping_address = ShippingAddress.objects.get(order=order)
                shipping_address.status = 'delivered'
                shipping_address.save()
            except ShippingAddress.DoesNotExist:
                pass

        return Response({'message': 'Payment processed successfully'}, status=status.HTTP_200_OK)



class PayPalSetupView(APIView):
    def post(self, request):
        amount = request.data.get('amount')
        email = request.data.get('email')

        if not amount or not email:
            return Response({'error': 'Amount and email are required'}, status=400)

        # Get access token
        auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        data = {'grant_type': 'client_credentials'}

        token_response = requests.post(
            f"{settings.PAYPAL_API_BASE}/v1/oauth2/token",
            auth=auth,
            headers=headers,
            data=data
        )

        if token_response.status_code != 200:
            return Response({'error': 'Failed to obtain PayPal access token'}, status=500)

        access_token = token_response.json()['access_token']

        # Create PayPal order
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}',
        }

        payload = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": "USD",
                    "value": str(amount)
                },
                "invoice_id": request.data.get('order_reference')  # Replace with actual logic to retrieve order reference
            }],
            "application_context": {
                "return_url": settings.PAYPAL_RETURN_URL,
                "cancel_url": settings.PAYPAL_CANCEL_URL
            }
        }

        order_response = requests.post(
            f"{settings.PAYPAL_API_BASE}/v2/checkout/orders",
            headers=headers,
            json=payload
        )

        if order_response.status_code != 201:
            return Response({'error': 'Failed to create PayPal order'}, status=500)

        order_data = order_response.json()
        approval_url = next((link['href'] for link in order_data['links'] if link['rel'] == 'approve'), None)

        return Response({
            'approval_url': approval_url,
            'paypal_order_id': order_data['id']
        })

class PayPalCaptureView(APIView):
    def post(self, request):
        order_id = request.data.get('order_id')
        email = request.data.get('email')

        if not order_id or not email:
            return Response({'error': 'order_id and email required'}, status=400)

        access_token = get_paypal_access_token()

        response = requests.post(
            f"{settings.PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
        )
        data = response.json()

        transaction_id = data['purchase_units'][0]['payments']['captures'][0]['id']
        amount = data['purchase_units'][0]['payments']['captures'][0]['amount']['value']

        try:
            user = CustomUser.objects.get(email=email)
            order = Order.objects.get(user=user, status='pending')
        except (CustomUser.DoesNotExist, Order.DoesNotExist):
            return Response({'error': 'User or pending order not found'}, status=404)

        with transaction.atomic():
            Payment.objects.create(
                order=order,
                payment_method='paypal',
                status='completed',
                transaction_id=transaction_id,
                amount=order.total_price
            )
            order.status = 'paid'
            order.save()

        return Response({'message': 'Payment captured', 'transaction_id': transaction_id})


def get_paypal_access_token():
    response = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/oauth2/token",
        auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET),
        headers={"Accept": "application/json"},
        data={"grant_type": "client_credentials"}
    )
    return response.json().get('access_token')

@csrf_exempt
def paypal_webhook(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Invalid method")
    
    event = json.loads(request.body.decode('utf-8'))
    event_type = event.get('event_type')
    
    if event_type == 'PAYMENT.CAPTURE.COMPLETED':
        resource = event.get('resource', {})
        invoice_id = resource.get('invoice_id')
        
        if not invoice_id:
            return JsonResponse({'status': 'error', 'message': 'invoice_id missing'}, status=400)
        
        try:
            order = Order.objects.get(reference=invoice_id)
        except Order.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Order not found'}, status=404)
        
        # Extract transaction_id from resource
        transaction_id = resource.get('id')

        # Avoid duplicate payments
        if not Payment.objects.filter(transaction_id=transaction_id).exists():
            Payment.objects.create(
                order=order,
                payment_method='paypal',
                status='completed',
                transaction_id=transaction_id,
                amount=order.total_price
            )
            
        order.is_paid = True
        order.status = 'paid'
        order.save()
        
        return JsonResponse({'status': 'success'})
    
    return JsonResponse({'status': 'ignored', 'message': f'Unhandled event type {event_type}'})

class PayPalReturnView(APIView):
    def get(self, request):
        paypal_order_id = request.GET.get("token")  # PayPal returns this as ?token=

        if not paypal_order_id:
            return Response({"error": "order_id is required"}, status=400)

        # Get PayPal token
        auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)
        token_response = requests.post(
            f"{settings.PAYPAL_API_BASE}/v1/oauth2/token",
            auth=auth,
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            data={'grant_type': 'client_credentials'}
        )

        if token_response.status_code != 200:
            return Response({'error': 'Failed to obtain access token'}, status=500)

        access_token = token_response.json()['access_token']

        # Capture the payment
        capture_response = requests.post(
            f"{settings.PAYPAL_API_BASE}/v2/checkout/orders/{paypal_order_id}/capture",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}'
            }
        )

        if capture_response.status_code != 201:
            return Response({'error': 'Failed to capture payment'}, status=500)

        payment_info = capture_response.json()

        # ✅ Process the order in your database
        # mark it as paid, attach payment info, etc.

        # Optionally redirect to a success page
        return redirect(f"{settings.FRONTEND_URL}/success")  # Or return a JSON response


class PayPalCancelView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        order_id = request.query_params.get('order_id')
        if not order_id:
            return Response({'error': 'order_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=order_id, status='pending')
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        # Redirect to cancel page or handle accordingly
        return Response({'message': 'Payment cancelled', 'order_id': order.id}, status=status.HTTP_200_OK)


def create_swish_payment(amount, phone, reference):
    SWISH_API_URL = getattr(settings, 'SWISH_API_URL')  # Replace with actual URL
    url = SWISH_API_URL + '/paymentrequests'
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "payeeAlias": getattr(settings, 'SWISH_PAYEE_ALIAS', 'default_alias'),
        "amount": str(amount),
        "currency": "SEK",
        "message": "AbrenCoffee Order",
        "payerAlias": phone,
        "callbackUrl": getattr(settings, 'SWISH_CALLBACK_URL', 'https://example.com/callback'),
        "payeePaymentReference": reference,
    }

    CERT_PATH = getattr(settings, 'SWISH_CERT_PATH', '/path/to/cert.pem')
    KEY_PATH = getattr(settings, 'SWISH_KEY_PATH', '/path/to/key.pem')
    response = requests.post(url, json=payload, cert=(CERT_PATH, KEY_PATH), headers=headers)
    if response.status_code not in [200, 201]:
        print("Swish error:", response.status_code, response.text)
        return None

    return {
        'paymentRequestToken': 'test-token',
        'payeePaymentReference': reference
    }


class SwishSetupView(APIView):
    permission_classes = [AllowAny]

    def create_swish_order(self, amount, phone_number):
        # Simulated Swish order
        return {
            'status': 'success',
            'transaction_id': f'swish-mock-{uuid.uuid4()}',
            'message': 'Swish payment initiated (mock)',
            'payeePaymentReference': f'ref-{uuid.uuid4()}',
        }


    def post(self, request):
        data = request.data
        amount = data.get('amount')
        phone_number = data.get('phone_number')

        if not amount or not phone_number:
            return Response({'error': 'amount and phone_number required'}, status=400)

        swish_response = self.create_swish_order(amount, phone_number)

        if not swish_response or swish_response.get('status') != 'success':
            return Response({'error': 'Failed to create Swish order'}, status=500)

        # Save the mock order
        order = Order.objects.create(
            reference=swish_response['payeePaymentReference'],
            status='pending',
            total_amount=amount,
        )
        Payment.objects.create(
            order=order,
            method='swish',
            status='pending',
            amount=amount,
        )

        return Response({
            'message': swish_response['message'],
            'transaction_id': swish_response['transaction_id'],
            'reference': swish_response['payeePaymentReference'],
        }, status=200)
    

class MockSwishCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        reference = request.data.get('reference')

        try:
            order = Order.objects.get(reference=reference)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)

        payment = Payment.objects.get(order=order)
        payment.status = 'paid'
        payment.payment_id = f'mock-tx-{uuid.uuid4()}'
        payment.paid_at = timezone.now()
        payment.save()

        order.status = 'processing'
        order.is_paid = True
        order.save()

        return Response({'message': 'Mock payment completed successfully'})

class SwishWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data

        # Expected fields from Swish
        ref = data.get('payeePaymentReference')
        status_str = data.get('status')  # "PAID", "DECLINED", etc.
        transaction_id = data.get('paymentReference')
        amount = data.get('amount')
        date_paid = data.get('datePaid')

        if not ref:
            return Response({'error': 'Missing reference'}, status=400)

        try:
            order = Order.objects.get(reference=ref)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)

        # Update the order/payment
        payment, _ = Payment.objects.get_or_create(order=order)
        payment.status = status_str.lower()
        payment.payment_id = transaction_id
        payment.amount = amount
        payment.paid_at = make_aware(datetime.fromisoformat(date_paid.replace('Z', '+00:00')))
        payment.method = 'swish'
        payment.save()

        if status_str == "PAID":
            order.status = 'processing'
            order.is_paid = True
            order.save()

        return Response({'message': 'Swish webhook processed successfully'}, status=200)



class InvoiceCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        order_id = request.data.get('order_id')
        amount = request.data.get('amount')
        currency = request.data.get('currency', 'SEK')

        if not order_id or not amount:
            return Response({'error': 'Missing order_id or amount'}, status=400)

        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)

        invoice = Invoice.objects.create(
            user=request.user if request.user.is_authenticated else None,
            session_key=request.session.session_key if not request.user.is_authenticated else None,
            order=order,
            amount=amount,
            currency=currency,
            status='pending'
        )

        # ✅ generate the PDF immediately
        generate_invoice_pdf(invoice)

        serializer = InvoiceSerializer(invoice, context={'request': request})
        return Response(serializer.data, status=201)


class InvoiceDownloadView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, invoice_id):
        try:
            invoice = Invoice.objects.get(id=invoice_id)
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)

        if not invoice.pdf:
            return Response({'error': 'Invoice PDF not available'}, status=status.HTTP_404_NOT_FOUND)

        response = HttpResponse(invoice.pdf.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.id}.pdf"'
        return response
    

class InvoiceView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        invoice = Invoice.objects.all()
        serializer = InvoiceSerializer(invoice, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class InvoiceListView(APIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user).order_by('-created_at')
    
    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    

class InvoiceDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        invoice = get_object_or_404(Invoice, id=pk)
        serializer = InvoiceSerializer(invoice, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class InvoiceDeleteView(APIView):
    permission_classes = [IsAdminUser]
    
    def delete(self, request, pk):
        invoice = Invoice.objects.get(id=pk)
        invoice.delete()
        return Response(status=status.HTTP_200_OK)
    
    
