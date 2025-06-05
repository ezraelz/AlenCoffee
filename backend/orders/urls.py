from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ShippingAddressCreateView,
    ShippingAddressListView,
    ShippingAddressDetailView,
    ShippingAddressUpdateView,
    ShippingAddressDeleteView,
    PaymentListView, StripeCheckoutView, 
    stripe_webhook_view, OrderCreateView, OrderListView,
    OrderDeleteView, OrderUpdateView, OrderDetailView,
    PendingOrderView, CancelOrderView,
    SwishSetupView, SwishWebhookView, PayPalSetupView,
    InvoiceCreateView, InvoiceDownloadView, InvoiceListView,
    InvoiceView, InvoiceDetailView,PayPalReturnView, PayPalCancelView, ShippingAddressRetrieveView,
    MockSwishCallbackView,InvoiceDeleteView
)


urlpatterns = [
    # Shipping address management
    path('shipping-address/', ShippingAddressListView.as_view(), name='shipping-address-list'),
    path('shipping/create/', ShippingAddressCreateView.as_view(), name='shipping-address-create'),
    path('shipping/<int:pk>/', ShippingAddressDetailView.as_view(), name='shipping-address-detail'),
    path('shipping/<int:pk>/update/', ShippingAddressUpdateView.as_view(), name='shipping-address-update'),
    path('shipping/<int:pk>/delete/', ShippingAddressDeleteView.as_view(), name='shipping-address-delete'),
    path('shipping/user/', ShippingAddressListView.as_view(), name='user-shipping-address-list'),
    path('shipping/retrieve/', ShippingAddressRetrieveView.as_view(), name='retrieve-shipping-address'),

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

    # Order management
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('list/', OrderListView.as_view(), name='order_list'),
    path('delete/<int:pk>/', OrderDeleteView.as_view(), name='order-delete'),
    path('update/<int:pk>/', OrderUpdateView.as_view(), name='order-update'),
    path('detail/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),

    path('pending/', PendingOrderView.as_view()),
    path('<int:order_id>/cancel/', CancelOrderView.as_view()),
    # Invoice management
    path('invoices/', InvoiceView.as_view(), name='invoice-list'),
    path('invoices/user/', InvoiceListView.as_view(), name='user-invoices'),
    path('invoices/detail/<int:pk>/', InvoiceDetailView.as_view(), name='invoice-detail'),
    path('invoices/create/<int:pk>/', InvoiceCreateView.as_view(), name='create-invoice'),
    path('invoices/delete/<int:pk>/', InvoiceDeleteView.as_view(), name='delete-invoice'),
    path('invoices/download/<int:pk>/', InvoiceDownloadView.as_view(), name='download-invoice'),

]
