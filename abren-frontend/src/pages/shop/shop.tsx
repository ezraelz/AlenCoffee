import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import Leftsidebar from '../../component/leftsidebar';
import { useCart } from './useCart'; // ✅ Import global cart context
import './shop.css';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingProductIds, setLoadingProductIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const { cartItemCount,addItem } = useCart(); // ✅ Use global cart context

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

  const handleAddToCart = async (product: Product) => {
    if (loadingProductIds.has(product.id)) return;

    setLoadingProductIds((prev) => new Set(prev).add(product.id));

    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        '/cart/add/',
        { product_id: product.id, quantity: 1 },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );

      await fetchCartData(); // ✅ Refresh global cart
      setMessage('Item added to the cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setLoadingProductIds((prev) => {
        const updated = new Set(prev);
        updated.delete(product.id);
        return updated;
      });
    }
  };

  return (
    <div className="shop">
      
      <div className="container">
        <div className="shop-hero">
          <h1 className="shop-title">Our Products</h1>
          <p className="shop-description">
            Alen is a modern e-commerce platform dedicated to providing high-quality products and seamless shopping experiences. 
            We believe in innovation, reliability, and customer satisfaction.
          </p>
      </div>
        {error && <div className="error-banner">{error}</div>}
        {message && (
          <div className="item-added">
            {message} (Cart: {cartItemCount})
          </div>
        )}

        <div className="product-grid">
          {products.map((product) => {
            const isLoading = loadingProductIds.has(product.id);
            const isOutOfStock = product.stock === 0;

            return (
              <article className="product-card" key={product.id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <div className="product-details">
                  <p className="price">${product.price.toFixed(2)}</p>
                </div>
                <button
                  className="addCart"
                  onClick={() => addItem(product)}
                  disabled={isLoading || isOutOfStock}
                  type="button"
                >
                  {isLoading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  className="viewCart"
                  onClick={() => navigate(`/product/${product.id}`)}
                  type="button"
                >
                  View Product
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shop;
function fetchCartData() {
  throw new Error('Function not implemented.');
}

