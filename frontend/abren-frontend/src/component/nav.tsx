import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext'; // ✅ Import the hook
import { useCart } from '../pages/shop/useCart'

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

const Nav: React.FC = () => {
  const { cartItemCount } = useCart();
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // ✅ Use context here
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({ id: 0, cart_items: [], total_price: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scrolledUp, setScrolledUp] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);
  const location = useLocation();

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
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/auth/status/', {
          withCredentials: true,
        });

        if (response.data.isAuthenticated) {
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
    fetchCartData();
  }, [setIsLoggedIn]);

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
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const dropdown = [
    { name: 'All Products', to: '/shop' },
    { name: 'Single Product', to: '/product/1' },
    { name: 'Cart', to: '/cart' },
    { name: 'Checkout', to: '/checkout' },
  ];

  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('access_token');
      if (refreshToken) {
        await axios.post(
          '/api/logout/',
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      setCartCount(0);
    }
  };

  const navLinks = [
    { name: 'About', to: '/about', is_active: `nav-item ${isActive('/about') ? 'active' : ''}` },
    { name: 'Services', to: '/services', is_active: `nav-item ${isActive('/services') ? 'active' : ''}` },
    { name: 'Blog', to: '/blog', is_active: `nav-item ${isActive('/blog') ? 'active' : ''}` },
    { name: 'Menu', to: '/menu', is_active: `nav-item ${isActive('/menu') ? 'active' : ''}` },
    { name: 'Contact', to: '/contact', is_active: `nav-item ${isActive('/contact') ? 'active' : ''}` },
    {
      name: isLoggedIn ? 'Logout' : 'Login',
      to: isLoggedIn ? '#' : '/login',
      onClick: isLoggedIn ? handleLogout : undefined,
    },
    {
      name: isLoggedIn ? '' : 'Register',
      to: isLoggedIn ? '#' : '/register',
    },
  ];

  return (
    <>
      <div className={scrolledUp ? 'navbar scroll' : 'navbar'} onScroll={() => handleScrollChange()}>
        <div className='nav_second'>
          <p>Order now and get 10% discount</p>
        </div>
        <nav>
          <div className="container">
            <Link className="navbar-brand" to="/">
              Aberen<small>Coffee</small>
            </Link>
            <button className="navbar-toggler" onClick={handleDropdown}>
              <span className="oi oi-menu">Menu</span>
            </button>

            <div className="collapse navbar-collapse" id="ftco-nav">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle"
                    style={{ cursor: 'pointer' }}
                    onClick={handleDropdown}
                  >
                    Shop
                  </span>
                  {isOpen && (
                    <div className="dropdown-menu">
                      <ul>
                        {dropdown.map((li, index) => (
                          <li key={index}>
                            <Link className="dropdown-item" to={li.to}>
                              {li.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>

                {navLinks.map((link, index) =>
                  link.name ? (
                    <li key={index} className={link.is_active}>
                      <Link to={link.to} className="nav-link" onClick={link.onClick}>
                        {link.name}
                      </Link>
                    </li>
                  ) : null
                )}
              </ul>
            </div>

            <div className="carts">
              <p>
                <Link to="/cart" className={isActive('/cart') ? 'active' : ''}>
                  <span className="icon-shopping_cart">
                    <FaShoppingCart />
                  </span>
                  <span className="bag">
                    Cart <small>{cartItemCount}</small>
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </nav>
        
      </div>
      
    </>
  );
};

export default Nav;
