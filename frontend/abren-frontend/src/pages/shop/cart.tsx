import React from 'react';
import './cart.css';
import { useCart } from '../../pages/shop/useCart';
import { Link } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeItem, totalPrice, updateItemQuantity } = useCart();

  if (!isOpen) return null;

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
                  <span className="cart-item-name">{item.product.name}</span>
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
            <Link to="/checkout" className="checkout-btn" onClick={onClose}>
              Proceed to Checkout
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
