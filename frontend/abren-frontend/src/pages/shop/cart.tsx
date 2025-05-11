import React, { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axios';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

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
  price: number | string;
  total_price?: number;
}

interface Cart {
  id: number;
  cart_items: CartItem[];
  total_price: number;
}


const Cart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);  // Use Cart type
  const [error, setError] = useState<string | null>(null);
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
    window.addEventListener('scroll', handleScrollChange);

    return () => {
      window.removeEventListener('scroll', handleScrollChange);
    };
  }, []);

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
        console.error('Failed to load data:', error);
        setError('Failed to load initial data. Please try again later.');
      }
    };

    fetchInitialData();
    fetchCartData(); // Fetch initial cart data
  }, []);

  // Function to fetch the cart data
  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get<Cart>('/cart/', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      setCart(response.data); // Update cart state with the latest data
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setError('Failed to load cart data.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!cart) {
    return <div>Loading...</div>;
  }

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Optional: prevent decreasing below 1
  
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`/cart/update/${productId}/`, 
        { quantity: newQuantity },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      fetchCartData(); // Refresh cart
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  
  const handleRemoveItem = async (productId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`/cart/delete/${productId}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      fetchCartData(); // Refresh cart
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  
  const cartItemCount = cart.cart_items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className='cart-items'>
      <div className={scrolledUp ? 'hero top' : 'hero'}>
      <h1><span className='counter'>{cartItemCount}</span>
        <FaShoppingCart/> Your Cart</h1>
      </div>
      <div className="content">
        <div className='product-grid'>
          {cart && cart.cart_items.length > 0 ? (
            <>
              {cart?.cart_items.map((item, index) => {
                const imageUrl = item.product.image.startsWith('http')
                  ? item.product.image
                  : `http://127.0.0.1:8000${item.product.image}`;

                return (
                  <div key={index} className='cart-item'>
                    <img src={imageUrl} alt={item.product.name} />
                    <div className="description">
                      <p>{item.product.name}</p>
                      <p>${item.product.price}</p>
                      <p>Qty: {item.quantity}</p>
                      <div className="controls">
                        <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}>-</button>
                        <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}>+</button>
                        <button onClick={() => handleRemoveItem(item.product.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p className='empty'>Your cart is <span> empty! </span> </p>
          ) }
          

        </div>

        <div className="checkout-cart">
          <h2>Total: ${cart.total_price}</h2>  {/* Access total_price from the `cart` object */}
          <button type='button'><Link to={'/checkout'}>Checkout</Link></button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
