import React, { useEffect, useRef, useState } from 'react';
import axios from '../../utils/axios';
import { useCart } from '../../pages/shop/useCart'; // ✅ Import global cart context
import { useNavigate } from 'react-router-dom';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image: string;
    quantity: number;
  }

const Trending_products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingProductIds, setLoadingProductIds] = useState<Set<number>>(new Set());
  const { fetchCartData, cartItemCount } = useCart(); // ✅ Use global cart context
  const navigate = useNavigate();
  const [scrolledUp, setScrolledUp] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);
  
    const handleScrollChange = () => {
      const currentScrollY = window.scrollY;
  
      if (currentScrollY > lastScrollY.current) {
        setScrolledUp(true); // User is scrolling up
      } else {
        setScrolledUp(false); // User is scrolling down
      }
  
      lastScrollY.current = currentScrollY;
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScrollChange);
      return () => window.removeEventListener('scroll', handleScrollChange);
    }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const productsResponse = await axios.get<Product[]>('/products/list/');
        setProducts(productsResponse.data);
        console.log(productsResponse.data);
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
    <div className="trending-products">
        <h1>Trending Products</h1>
        
        {products.length > 0 ? (
            <div className='product_container'>
                {products.map((product, index) => (
                    <div className={scrolledUp ? "product_card anime": 'product_card'} key={index}>
                        <img src={product.image} alt="" />
                        <div className="description">
                            <p>{product.name}</p>
                            <p>${product.price}</p>
                        </div>
                        <div className="button-group">
                            <button
                                className="addCart"
                                onClick={() => handleAddToCart(product)}
                                type="button"
                                >
                                Add to Cart
                            </button>
                            <button
                                className="viewCart"
                                onClick={() => navigate(`/product/${product.id}`)}
                                type="button"
                                >
                                View Product
                            </button>
                        </div>
                        
                    </div>
                ))}
            </div>
        ) : (
            <>
                <p>Loading products....</p>
            </>
        )}
    </div>
  )
}

export default Trending_products
