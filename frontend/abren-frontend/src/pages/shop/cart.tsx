import React from 'react';
import './cart.css';
import { useCart } from '../../pages/shop/useCart';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';


interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeItem, totalPrice, updateItemQuantity } = useCart();
  const navigate = useNavigate();


  if (!isOpen) return null;

  // Inside CartPage.tsx or similar
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('/orders/create/', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });

      if (response.status !== 201) {
        throw new Error('Failed to create order');
      }
  
      const data = response.data;
      const orderId = data.order_id;
  
      // Redirect to shipping page with order ID
      navigate(`/checkout/${orderId}`);
    } catch (err) {
      console.error(err);
      alert('Could not create order. Try again.');
    }
  };

  return (
    <div className="cart-modal-backdrop" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="cart-items-list">
            {cartItems.map((item) => (
              <li key={item.product.id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.product.name} - </span>
                  <span className="cart-item-price">
                    ${item.price} × {item.quantity}
                  </span>
                </div>

                <div className="cart-item-controls">
                  <button onClick={() =>
                    updateItemQuantity(item.product.id, item.quantity - 1)
                  }>
                    ➖
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() =>
                    updateItemQuantity(item.product.id, item.quantity + 1)
                  }>
                    ➕
                  </button>

                  <button onClick={() => removeItem(item.product.id)}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cartItems.length > 0 && (
          <>
            <div className="cart-total">
              <strong>Total:</strong> ${totalPrice.toFixed(2)}
            </div>
            <button 
              type='submit'
              className="checkout-btn"
              onClick={() => {
                if (onClose) onClose();
                handleCheckout();
              }}
            >
              Proceed to Checkout
            </button>


          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
