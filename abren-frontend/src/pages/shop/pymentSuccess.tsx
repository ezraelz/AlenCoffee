import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const [cleared, setCleared] = useState(false);
  const [captureDone, setCaptureDone] = useState(false);

  const [searchParams] = useSearchParams();
  const paypalOrderId = searchParams.get('token'); // PayPal sends ?token=<paypal_order_id>

  useEffect(() => {
    const capturePayPalOrder = async () => {
      if (!paypalOrderId) {
        toast.error('❌ Missing PayPal order ID');
        return;
      }

      try {
        const response = await axios.post('/payment/paypal/capture/', {
          paypal_order_id: paypalOrderId,
        });

        console.log('PayPal capture response:', response.data);
        setCaptureDone(true);
        toast.success('✅ PayPal payment captured successfully!');
      } catch (error) {
        console.error('Error capturing PayPal order:', error);
        toast.error('⚠️ Failed to capture PayPal payment.');
      }
    };

    capturePayPalOrder();
  }, [paypalOrderId]);

  useEffect(() => {
    const clearCart = async () => {
      try {
        const token = localStorage.getItem('access_token');
        await axios.post('/cart/clear/', {}, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        setCleared(true);
        toast.success('✅ Cart cleared!');
      } catch {
        toast.error('⚠️ Payment succeeded but failed to clear cart.');
      }
    };

    // Only clear cart AFTER PayPal capture
    if (captureDone) {
      clearCart();
    }
  }, [captureDone]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', margin: '14em auto' }}>
      <h1>🎉 Thank You for Your Purchase!</h1>
      {captureDone ? (
        <p>Your payment has been successfully captured.</p>
      ) : (
        <p>⏳ Finalizing your PayPal payment...</p>
      )}
      {captureDone && cleared ? (
        <p>🛒 Your cart has been cleared.</p>
      ) : (
        captureDone && <p>⏳ Clearing your cart...</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
