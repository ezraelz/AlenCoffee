import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import ShippingForm from '../../component/shoppingform';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number | string;
  total_price?: number;
}

interface Cart {
  id: number;
  cart_items: CartItem[];
  total_price: number;
}

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [scrolledUp, setScrolledUp] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address1: '',
    address2: '',
    city: '',
    street: '',
    state: '',
    country: '',
    zipcode: '',
  });

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get<Cart>('/cart/', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        setCart(response.data);
      } catch {
        toast.error('❌ Failed to load cart data.');
      }
    };

    fetchCartData();

    const handleScroll = () => setScrolledUp(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('/orders/shipping/create/', formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });

      setOrderSuccess(true);
      setFormData({ name: '', email: '', address: '', city: '', zip: '' });
      toast.success('✅ Order placed successfully!');
    } catch {
      toast.error('❌ Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentRedirect = async (method: string) => {
    setPaymentLoading(true);
    try {
      const response = await axios.post(`/orders/payments/${method}/`, {}, { withCredentials: true });
      window.location.href = response.data.redirect_url || response.data.approval_url;
    } catch {
      toast.error(`❌ Payment failed with ${method}.`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    setPaymentLoading(true);
    try {
      const response = await axios.post('orders/payments/stripe/', {}, { withCredentials: true });
      const stripe = (window as any).Stripe(response.data.stripe_public_key);
      await stripe.redirectToCheckout({ sessionId: response.data.session_id });
    } catch {
      toast.error('❌ Stripe checkout failed.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="checkout">
      <div className={scrolledUp ? 'hero top' : 'hero'}>
        <h1>
      {orderSuccess && <p style={{ color: 'green' }}>🎉 Your order has been placed!</p>}
      Checkout  </h1>
      </div>
      <div className="checkout-container">
        <div className="shipping-info">
          <h3>Shipping Information</h3>
          <ShippingForm
            formData={formData}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          <h3>Choose a Payment Method</h3>
          <div className="payment-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={handleStripeCheckout} disabled={paymentLoading || !cart}>
              {paymentLoading ? 'Processing...' : '💳 Pay with Stripe (Visa/MasterCard)'}
            </button>
            <button onClick={() => handlePaymentRedirect('paypal')} disabled={paymentLoading || !cart}>
              💰 Pay with PayPal
            </button>
            <button onClick={() => handlePaymentRedirect('klarna')} disabled={paymentLoading || !cart}>
              🧾 Pay with Klarna
            </button>
            <button onClick={() => handlePaymentRedirect('swish')} disabled={paymentLoading || !cart}>
              📱 Pay with Swish
            </button>
          </div>
        </div>

        <div className="cart-summary">
          {cart && cart.cart_items.length > 0 ? (
            <>
              <h3>Cart Summary</h3>
              <ul>
                {cart.cart_items.map((item, idx) => (
                  <li key={idx}>
                    {item.product.name} × {item.quantity} = ${item.total_price?.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ${cart.total_price.toFixed(2)}</p>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
