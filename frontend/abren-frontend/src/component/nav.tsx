import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../pages/shop/useCart';

interface NavProps {
  onCartClick: () => void;
}

const Nav: React.FC<NavProps> = ({ onCartClick }) => {
  const { cartItemCount } = useCart();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolledUp, setScrolledUp] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);
  const location = useLocation();

  const handleScrollChange = () => {
    const currentScrollY = window.scrollY;
    setScrolledUp(currentScrollY > lastScrollY.current);
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollChange);
    return () => window.removeEventListener('scroll', handleScrollChange);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/auth/status/', { withCredentials: true });
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
  }, [setIsLoggedIn]);

  const isActive = (path: string) => location.pathname === path;

  const dropdown = [
    { name: 'All Products', to: '/shop' },
    { name: 'Single Product', to: '/product/1' },
    { name: 'Cart', to: '/cart' },
    { name: 'Checkout', to: '/checkout' },
  ];

  const handleDropdown = () => setIsOpen((prev) => !prev);

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
    }
  };

  const navLinks = [
    { name: 'About AbrenCoffee', to: '/about' },
    { name: 'Services', to: '/services' },
    { name: 'Gifts', to: '/blog' },
    { name: 'Blog', to: '/blog' },
    { name: 'Menu', to: '/menu' },
    { name: 'Contact', to: '/contact' },
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

  const sideLinks = [
    { link: '/search', icon: <FaSearch /> },
    { link: '/profile', icon: <FaUser /> },
    { link: '#', icon: <FaShoppingCart />, onClick: onCartClick },
  ];

  return (
    <div className={scrolledUp ? 'navbar scroll' : 'navbar'}>
      <div className='nav_second'>
        <p>Order now and get 10% discount</p>
      </div>
      <nav>
        <div className="container">
          <Link className="navbar-brand" to="/">
            Abren<small>Coffee</small>
          </Link>
          <button className="navbar-toggler" onClick={handleDropdown}>
            <span className="oi oi-menu">Menu</span>
          </button>

          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" onClick={handleDropdown} style={{ cursor: 'pointer' }}>
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

              {navLinks.map(
                (link, index) =>
                  link.name && (
                    <li
                      key={index}
                      className={`nav-item ${isActive(link.to) ? 'active' : ''}`}
                    >
                      <Link to={link.to} className="nav-link" onClick={link.onClick}>
                        {link.name}
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </div>

          <div className="side">
            {sideLinks.map((link, index) => (
              <div className="link-group" key={index}>
                <Link to={link.link} className="link" >
                  <span className="icon" onClick={e=> {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}>{link.icon}</span>
                </Link>
              </div>
            ))}
            <div className="cart">
              <small>{cartItemCount}</small>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
