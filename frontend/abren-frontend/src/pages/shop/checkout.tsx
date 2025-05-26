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
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [shippingAddressId, setShippingAddressId] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [totlalPrice, setTotalPrice] = useState<number>(0);
  const { setShowNav } = useNavVisibility();
  const navigate = useNavigate();

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
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get<Cart>('/cart/', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        setCart({
          ...response.data,
          cart_items: response.data.cart_items.map(item => ({
            ...item,
            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
            total_price: item.total_price !== undefined ? item.total_price : item.price * item.quantity, // Ensure total_price is always a number
          })),
        });

        setTotalPrice(response.data.total_price);
      } catch {
        toast.error('❌ Failed to load cart data.');
      }
    };

    fetchCartData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.post('/orders/shipping/create/', formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
  
      setShippingAddressId(res.data.id); // 👈 Capture the ID
      setPhoneNumber(res.data.phone_number);
      console.log(res.data.phone_number);

      setStep(1);
    } catch(err) {
      console.error(err.response?.data); // ✅ Add this line
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
    
    console.log(shippingAddressId);
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('/orders/create/', {
        shipping_address_id: shippingAddressId,
        total_price: totlalPrice,
        phone_number: formData.phone_number,
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
  
      toast.success('✅ Order created successfully!');
      setStep(2); // Move to Payment
    } catch(err) {
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
            onChange={handleChange}
            onSubmit={handleShippingSubmit}
            loading={loading}
          />
        )}

        {step === 1 && cart && shippingAddressId !== null && (
          <Review cart={cart} formData={formData} phoneNumber={phoneNumber} shippingAddressId={shippingAddressId} onBack={() => setStep(0)} onConfirm={handleOrderSubmit} loading={loading} />
        )}

        {step === 2 && cart && (
          <PaymentMethods
            cart={cart}
            email={formData.email}
            loading={paymentLoading}
            setLoading={setPaymentLoading}
            phoneNumber={phoneNumber}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
