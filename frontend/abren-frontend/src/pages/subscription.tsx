import React, { useEffect, useState } from 'react';
import './Subscription.css'; // Make sure this matches your folder structure
import { Link, useNavigate } from 'react-router-dom';
import { FaCcAmazonPay, FaCcMastercard, FaCcPaypal, FaCcStripe } from 'react-icons/fa';
import { FaCcVisa } from 'react-icons/fa6';
import { useCart } from './shop/useCart';
import axios from '../utils/axios';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
}

const Subscription:React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingProductIds, setLoadingProductIds] = useState<Set<number>>(new Set());
  const { cartItems, removeItem, totalPrice, updateItemQuantity, cartItemCount,addItem } = useCart();
  const navigate = useNavigate();

  const guides = [
    {number: 1, title: 'Choose Your Favorite Coffee'},
    {number: 2, title: 'Detrmine order interval'},
    {number: 3, title: 'Add to cart and All done'}
  ]

  useEffect(() => {
      const fetchInitialData = async () => {
        try {
          const productsResponse = await axios.get<Product[]>('/products/list/');
          setProducts(
            productsResponse.data.map((p) => ({
              ...p,
              price: Number(p.price),
              quantity: Number(p.quantity),
            }))
          );
        } catch (error) {
          console.error('Failed to load products:', error);
          setError('Failed to load products. Please try again later.');
        }
      };
  
      fetchInitialData();
     
    }, []);

  return (
    <div className="subscription">
      <div className="subscription-container">
        <div className="subscription-hero">
          <h1 className="subscription-title">Subscribe to Fresh Coffee</h1>
          <p className="subscription-intro">
            Enjoy our premium coffee delivered straight to your door every week or month. Choose a plan that suits your taste and schedule.
          </p>
          <p>Enjoy 10% discount on Subscription</p>
          <div className="subscripton-payment">
            <Link to="https://www.facebook.com/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaCcMastercard aria-label="Facebook" />
            </Link>
            <Link to="https://www.instagram.com/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaCcVisa aria-label="Instagram" />
            </Link>
            <Link to="https://www.tiktok.com/@abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaCcAmazonPay aria-label="TikTok" />
            </Link>
            <Link to="https://www.twitch.tv/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaCcPaypal aria-label="Twitch" />
            </Link>
            <Link to="https://x.com/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaCcStripe aria-label="X (formerly Twitter)" />
            </Link>
          </div>
        </div>

        <div className="subscription-plans">
          <div className="plan-card">
            <h2>Weekly Plan</h2>
            <p>Fresh coffee delivered every week. Perfect for busy professionals and daily brewers.</p>
            <span className="price">$15/week</span>
          </div>

          <div className="plan-card">
            <h2>Monthly Plan</h2>
            <p>A curated selection of beans delivered once a month. Ideal for occasional coffee lovers.</p>
            <span className="price">$45/month</span>
          </div>

          <div className="plan-card">
            <h2>Office Plan</h2>
            <p>Keep the team fueled with bulk deliveries for your workspace or business.</p>
            <span className="price">Custom Quote</span>
          </div>
        </div>

        <div className="subscription-guide">
          {guides.map((guide, index) => (
            <div className="guid-card" key={index}>
              <span>{guide.number}</span>
              <p>{guide.title}</p>
            </div>
          ))}
        </div>

        <div className="subscription-items">
          {products.map((product) => {
            const isLoading = loadingProductIds.has(product.id);
            const isOutOfStock = product.stock === 0;
            const quantity = product.quantity ?? 1; // fallback if undefined

            return (
              <article className="item-card" key={product.id}>
                <img src={product.image} alt={product.name} className="product-image" />

                <h3 className="product-name">{product.name}</h3>

                <div className="product-details">
                  <p className="price">${product.price.toFixed(2)}</p>
                </div>

                <button
                  className="addCart"
                  onClick={() => addItem(product)}
                  disabled={isLoading || isOutOfStock}
                  type="button"
                >
                  {isLoading
                    ? 'Adding...'
                    : isOutOfStock
                    ? 'Out of Stock'
                    : 'Add to Cart'}
                </button>

                <div className="cart-item-controls">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => updateItemQuantity(product.id, quantity - 1)}
                    disabled={quantity <= 1}
                    type="button"
                  >
                    ➖
                  </button>

                  <span className="cart-item-name">{cartItemCount}</span>

                  <button
                    aria-label="Increase quantity"
                    onClick={() => updateItemQuantity(product.id, quantity + 1)}
                    type="button"
                  >
                    ➕
                  </button>

                  <button
                    aria-label="Remove item"
                    onClick={() => removeItem(product.id)}
                    type="button"
                  >
                    🗑️
                  </button>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Subscription;

