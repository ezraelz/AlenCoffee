import React from 'react';
import { FaCcStripe, FaPaypal } from 'react-icons/fa';
import { SiKlarna, SiWish} from 'react-icons/si';
import styles from './PaymentMethods.module.css';
import axios from '../../utils/axios';

interface Cart {
  total_price: number;
}

interface Props {
  cart: Cart;
  email: string;
  loading: boolean;
  setLoading: (v: boolean) => void;
  phoneNumber: string; // Added phoneNumber prop
}

const PaymentMethods: React.FC<Props> = ({ cart, email, loading, setLoading, phoneNumber }) => {
  const paymentOptions = [
    { id: 'stripe', label: 'Stripe', icon: <FaCcStripe /> },
    { id: 'paypal', label: 'PayPal', icon: <FaPaypal /> },
    { id: 'klarna', label: 'Klarna', icon: <SiKlarna /> },
    { id: 'swish', label: 'Swish', icon: <SiWish/> },
  ];

  const handleStripePayment = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        '/orders/payments/stripe/',
        { email, amount: cart.total_price },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
  
      const { url } = response.data;
      if (url) {
        window.location.href = url;
      } else {
        console.error('Missing Stripe redirect URL.');
      }
    } catch (err) {
      console.error(err);
      alert('Stripe payment failed.');
    }
  };

  const handleSwishPayment = async () => {
    if (!cart?.total_price || !phoneNumber) {
      alert("Please enter your phone number and ensure the cart is loaded.");
      return;
    }
  
    try {
      const token = localStorage.getItem("access_token");
  
      const response = await axios.post<SetupPaymentResponse>(
        "/orders/payments/swish/setup/",
        {
          amount: cart.total_price,
          phone_number: phoneNumber, // ✅ use the passed-in prop
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
  
      const { approval_url } = response.data;
      if (approval_url) {
        window.location.href = approval_url;
      } else {
        alert("Swish payment initiated. Please approve it on your device.");
      }
    } catch (err) {
      console.error("Swish setup error:", err);
      alert("Swish setup failed. Please check your phone number and try again.");
    }
  };
  
  interface SetupPaymentResponse {
    approval_url?: string;
  }

  const setupPayment = async (method: string): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post<SetupPaymentResponse>(
        `/orders/payments/${method}/setup/`,
        { email, amount: cart.total_price },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
  
      const { approval_url } = response.data;
      if (approval_url) {
        window.location.href = approval_url;
      } else {
        console.error(`Missing ${method} approval URL.`);
      }
    } catch (err) {
      console.error(err);
      alert(`${method} setup failed.`);
    }
  };
  

  const handlePaypalPayment = () => setupPayment("paypal");
  const handleKlarnaPayment = () => setupPayment("klarna");
  

  const handlePayment = async (method: string) => {
    setLoading(true);
    switch (method) {
      case 'stripe':
        await handleStripePayment();
        break;
      case 'paypal':
        await handlePaypalPayment();
        break;
      case 'klarna':
        await handleKlarnaPayment();
        break;
      case 'swish':
        await handleSwishPayment();
        break;
      default:
        alert('Unsupported payment method');
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Choose Payment Method</h2>
      <div className={styles.section}>
        {paymentOptions.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => handlePayment(id)}
            disabled={loading}
            className={styles.button}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
      
      <p className={styles.total}>Total to Pay: ${cart.total_price.toFixed(2)}</p>
    </div>
  );
};

export default PaymentMethods;
