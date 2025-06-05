from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PaymentListView, StripeCheckoutView, 
    stripe_webhook_view, OrderCreateView, OrderListView,
    SwishSetupView, SwishWebhookView, PayPalSetupView,
    InvoiceCreateView, InvoiceDownloadView, InvoiceListView,
    InvoiceView, InvoiceDetailView,PayPalReturnView, PayPalCancelView,
    MockSwishCallbackView,InvoiceDeleteView
)

urlpatterns = [
    # Custom payment endpoints
    path('payments/stripe/', StripeCheckoutView.as_view(), name='stripe-checkout'),
    path('payments/paypal/setup/', PayPalSetupView.as_view(), name='paypal-checkout'),

    path('payment/paypal/return/', PayPalReturnView.as_view(), name='paypal-return'),
    path('payment/paypal/cancel/', PayPalCancelView.as_view(), name='paypal-cancel'),

    path('payments/swish/setup/', SwishSetupView.as_view(), name='swish-setup'),
    path('payments/swish/webhook/', SwishWebhookView.as_view(), name='swish-webhook'),
    path('payments/payment/swish/mock-callback/', MockSwishCallbackView.as_view(), name='mock-swish-callback'),

    path('payments/', PaymentListView.as_view(), name='payment-list'),
    path("stripe/", include("djstripe.urls", namespace="djstripe")),
    path('webhooks/stripe/', stripe_webhook_view, name='stripe-webhook'),

    # Invoice management
    path('invoices/', InvoiceView.as_view(), name='invoice-list'),
    path('invoices/user/', InvoiceListView.as_view(), name='user-invoices'),
    path('invoices/detail/<int:pk>/', InvoiceDetailView.as_view(), name='invoice-detail'),
    path('invoices/create/<int:pk>/', InvoiceCreateView.as_view(), name='create-invoice'),
    path('invoices/delete/<int:pk>/', InvoiceDeleteView.as_view(), name='delete-invoice'),
    path('invoices/download/<int:pk>/', InvoiceDownloadView.as_view(), name='download-invoice'),

]

