import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useNavVisibility } from '../../context/NavVisibilityContext';
import ShippingForm from '../../component/checkout/ShippingForm';
import Review from '../../component/checkout/Review';
import PaymentMethods from '../../component/checkout/PaymentMethods';
import CheckoutStepper from '../../component/checkout/CheckoutStepper';
import '../../component/checkout/CheckoutStepper.css';
import './checkout.css';

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
  price: number;
  total_price?: number;
}

interface Cart {
  id: number;
  cart_items: CartItem[];
  total_price: number;
}

type Step = 0 | 1 | 2;

const Checkout: React.FC = () => {
  const { step: stepParam } = useParams<{ step?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Read orderId from navigation state to resume payment
  const orderId = location.state?.orderId ?? null;

  // Determine initial step from URL param (fallback 0)
  const [step, setStep] = useState<Step>(() => {
    if (stepParam === 'payment') return 2;
    if (stepParam === 'review') return 1;
    return 0;
  });

  const [cart, setCart] = useState<Cart | null>(null);
  const [shippingAddressId, setShippingAddressId] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { setShowNav } = useNavVisibility();

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

  // Hide navigation on checkout page
  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, [setShowNav]);

  // Load cart data on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await axios.get<Cart>('/cart/', {
          headers,
          withCredentials: true,
        });

        const normalizedCart = {
          ...data,
          cart_items: data.cart_items.map(item => ({
            ...item,
            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
            total_price: item.total_price !== undefined ? item.total_price : item.price * item.quantity,
          })),
        };

        setCart(normalizedCart);
        setTotalPrice(data.total_price);
      } catch {
        toast.error('❌ Failed to load cart data.');
      }
    };

    fetchCart();
  }, []);

  // Sync step if URL param changes
  useEffect(() => {
    if (stepParam === 'payment') setStep(2);
    else if (stepParam === 'review') setStep(1);
    else setStep(0);
  }, [stepParam]);

  // Update URL when step changes
  useEffect(() => {
    const stepPath = step === 0 ? '' : step === 1 ? 'review' : 'payment';
    navigate(`/checkout/${stepPath}`, { replace: true, state: { orderId } });
  }, [step, navigate, orderId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Shipping form submit handler
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.post('/orders/shipping/create/', formData, {
        headers,
        withCredentials: true,
      });

      setShippingAddressId(data.id);
      setPhoneNumber(data.phone_number);
      setStep(1);
    } catch {
      toast.error('❌ Failed to save shipping info');
    } finally {
      setLoading(false);
    }
  };

  // Order confirmation handler
  const handleOrderSubmit = async () => {
    if (!shippingAddressId) {
      toast.error('Shipping address is missing.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.post(
        '/orders/create/',
        {
          shipping_address_id: shippingAddressId,
          total_price: totalPrice,
          phone_number: formData.phone_number,
          delivery_frequency: 'none',
        },
        { headers, withCredentials: true }
      );

      toast.success('✅ Order created successfully!');
      setStep(2);

      // Pass the newly created order ID to payment step
      navigate('/checkout/payment', { state: { orderId: data.id } });
    } catch {
      toast.error('❌ Failed to create order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        <CheckoutStepper currentStep={step} />

        {step === 0 && (
          <ShippingForm
            formData={formData}
            setFormData={setFormData}
            onChange={handleChange}
            onSubmit={handleShippingSubmit}
            loading={loading}
          />
        )}

        {step === 1 && cart && (
          <Review
            cart={cart}
            formData={formData}
            phoneNumber={phoneNumber}
            onBack={() => setStep(0)}
            onConfirm={handleOrderSubmit}
            loading={loading}
          />
        )}

        {step === 2 && cart && (
          <PaymentMethods
            cart={cart}
            email={formData.email}
            phoneNumber={phoneNumber}
            loading={paymentLoading}
            setLoading={setPaymentLoading}
            orderId={orderId}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
