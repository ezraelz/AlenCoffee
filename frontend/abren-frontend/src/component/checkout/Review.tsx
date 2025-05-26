import React from 'react';
import styles from './Review.module.css';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  total_price: number;
}

interface Cart {
  cart_items: CartItem[];
  total_price: number;
}

interface Props {
    cart: Cart;
    formData: Record<string, string>;
    shippingAddressId: number; // Add this line
    onBack: () => void;
    onConfirm: () => void;
    loading: boolean;
  }

const Review: React.FC<Props> = ({ cart, formData, onBack, onConfirm, loading}) => {

  return (
    <div className="review-container">
      <h2 className="review-title">Review Your Order</h2>

      <div className='review-section'>
        <h3 className='review-section-title'>Shipping Details</h3>
        {Object.entries(formData).map(([key, value]) => (
          <p key={key} className={styles.p}>
            <strong>{key.replace(/_/g, ' ')}:</strong> {value}
          </p>
        ))}
      </div>

      <div className={styles.section}>
        <h3 className={styles.title}>Items in Cart</h3>
        {cart.cart_items.map(({ product, quantity, total_price }) => (
          <div key={product.id} className={styles.itemRow}>
            <span>
              {product.name} × {quantity}
            </span>
            <span>${total_price.toFixed(2)}</span>
          </div>
        ))}
        <p className={styles.total}>Total: ${cart.total_price.toFixed(2)}</p>
      </div>

      <div className={styles.section}>
        <button onClick={onBack} className={styles.backBtn}>
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={styles.confirmBtn}
        >
          {loading ? 'Processing...' : 'Confirm and Pay'}
        </button>
      </div>
    </div>
  );
};

export default Review;
