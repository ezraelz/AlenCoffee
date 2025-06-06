from rest_framework.response import Response
from django.db.models.functions import TruncDate
from users.models import CustomUser
from users.serializers import UserSerializer
from orders.serializers import OrderSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from products.models import Product
from orders.models import OrderItem, Order
from payment.models import Payment
from products.serializers import ProductSerializer
from blog.models import Blog
from blog.serializers import BlogSerializer
from django.db.models import Sum, F, ExpressionWrapper, FloatField
from django.db.models.functions import Coalesce
from rest_framework.decorators import api_view, permission_classes
from django.utils.timezone import now, timedelta

class AdminUserAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        users = CustomUser.objects.exclude(role__name='admin')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "User ID is required for update."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "User ID is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(pk=pk)
            user.delete()
            return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class AdminRoleVerificationAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_superuser:
            return Response({"is_admin": True}, status=status.HTTP_200_OK)
        else:
            return Response({"is_admin": False}, status=status.HTTP_403_FORBIDDEN)
        
class AdminProductAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "Product ID is required for update."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Product ID is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(pk=pk)
            product.delete()
            return Response({"message": "Product deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

class AdminBlogAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        blogs = Blog.objects.all()
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "Blog ID is required for update."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blog = Blog.objects.get(pk=pk)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = BlogSerializer(blog, data=request.data, partial=True)  # partial=True = allow updating some fields
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Blog ID is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blog = Blog.objects.get(pk=pk)
            blog.delete()
            return Response({"message": "Blog deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found."}, status=status.HTTP_404_NOT_FOUND)

class TotalStockProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_stock = Product.objects.aggregate(total=Sum('stock'))['total'] or 0
        return Response({'total_stock': total_stock})
    

class TotalProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_products = Product.objects.count()
        return Response({'total_products': total_products})
    

class TotalSalesProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_sales = Payment.objects.filter(
            status='paid'  # adjust this depending on your model
        ).aggregate(total=Sum('amount'))['total'] or 0

        return Response({'total_sales': total_sales})

class AdminOrdersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
class AdminOrderDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request, pk):
        order = Order.objects.get(id=pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TotalOrdersCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_orders = Order.objects.count()
        return Response({'total_orders': total_orders})
   
class TotalOrderCompletedCountView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_completed_orders = Order.objects.filter(status='paid').count()
        return Response({'total_completed_orders': total_completed_orders})

class TopProductsView(APIView):
    def get(self, request):
        top_products = (
            Product.objects
            .filter(orderitem__order__status='paid')
            .annotate(
                popularity=Coalesce(Sum('orderitem__quantity'), 0),
                sales=Coalesce(
                    Sum(
                        ExpressionWrapper(
                            F('orderitem__quantity') * F('orderitem__price'),
                            output_field=FloatField()
                        )
                    ),
                    0.0
                )
            )
            .order_by('-sales')[:10]
            .values('id', 'name', 'popularity', 'sales')
        )
        return Response(top_products)
    
class SalesPerDayView(APIView):
    permission_classes = [IsAdminUser]  # Optional: Only admins allowed

    def get(self, request):
        today = now().date()
        seven_days_ago = today - timedelta(days=6)

        sales = (
            Order.objects
            .filter(status='paid', created_at__date__gte=seven_days_ago)
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(total_sales=Sum('total_price'))
            .order_by('day')
        )

        return Response(sales)