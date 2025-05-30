import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useNavVisibility } from '../../context/NavVisibilityContext';
import { useNavigate } from 'react-router-dom';
import ShippingForm from '../../component/checkout/ShippingForm';
import Review from '../../component/checkout/Review';
import PaymentMethods from '../../component/checkout/PaymentMethods';
import CheckoutStepper from '../../component/checkout/CheckoutStepper';
import '../../component/checkout/CheckoutStepper.css';

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
  const [step, setStep] = useState<Step>(0);
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

  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, [setShowNav]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    } catch (err: any) {
      console.error(err.response?.data);
      toast.error(
        `❌ Failed to save shipping info: ${
          err.response?.data?.detail || JSON.stringify(err.response?.data)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async () => {
    if (!shippingAddressId) {
      toast.error('Shipping address is missing.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(
        '/orders/create/',
        {
          shipping_address_id: shippingAddressId,
          total_price: totalPrice,
          phone_number: formData.phone_number,
          delivery_frequency: 'none', // Add actual value if supporting subscriptions
        },
        { headers, withCredentials: true }
      );

      toast.success('✅ Order created successfully!');
      setStep(2);
    } catch (err: any) {
      console.error(err.response?.data);
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

        {step === 1 && cart && shippingAddressId && (
          <Review
            cart={cart}
            formData={formData}
            phoneNumber={phoneNumber}
            shippingAddressId={shippingAddressId}
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
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
