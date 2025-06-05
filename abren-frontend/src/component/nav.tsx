import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { Link, useLocation} from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../pages/shop/useCart';
import './nav.css';
import NavShopProduct from './navShopProduct';
interface NavProps {
  onCartClick: () => void;
}

interface Product {
  name: string;
  id: number;
  image: string;
}

const Nav: React.FC<NavProps> = ({ onCartClick }) => {
  const { cartItemCount } = useCart();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [ products, setProducts] = useState<Product[]>([]);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolledUp, setScrolledUp] = useState(false);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(()=> {
    const fetchProducts = async () => {
      const response = await axios.get('/products/list');
      setProducts(response.data);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(response.data.role);
        setUsername(response.data.username);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    if (isLoggedIn) fetchRoleData();
  }, [isLoggedIn]);

  useEffect(() => {
    const handleScrollChange = () => {
      const currentScrollY = window.scrollY;
      setScrolledUp(currentScrollY > lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScrollChange);
    return () => window.removeEventListener('scroll', handleScrollChange);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await axios.post('/api/logout/', { refresh: token }, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
    }
  };

  const navLinks = [
    { name: 'About AlenCoffee', to: '/about' },
    { name: 'Services', to: '/services' },
    { name: 'Gifts', to: '/gifts' },
    { name: 'Blog', to: '/blog' },
    { name: 'Contact', to: '/contact' },
    { name: 'Subscribtion', to: '/subscription' },
  ].filter(Boolean);

  const shopDropdown = [
    { name: 'All Products', to: '/shop' },
    { name: 'Checkout', to: '/checkout' },
  ];

  const profileDropdown = [
    { name: isLoggedIn ? 'Profile' : '', to: '/profile' },
    role === 'admin' ? { name: 'Dashboard', to: '/admin' } : null,
    { name: 'Settings', to: '/settings' },
    { name: isLoggedIn ? 'Logout' : 'Login', to: '/login', onClick: handleLogout },
    { name: isLoggedIn ? '' : 'Register', to: '/register', onClick: handleLogout },
  ].filter((item): item is { name: string; to: string; onClick?: () => Promise<void> } => item !== null);

  const sideLinks = [
    { link: '/search', icon: <FaSearch /> },
    { link: '#', icon: <FaUser />, onClick: () => setIsProfileOpen(prev => !prev) },
    { link: '#', icon: <FaShoppingCart />, onClick: onCartClick },
  ];

  return (
    <div className={scrolledUp ? 'navbar scroll' : 'navbar'}>
      <div className='nav_second'>
        <p>10% discount on Subscription</p>
      </div>
      <nav>
        <div className="container">
          <Link className="navbar-brand" to="/">
            Alen<small>Coffee</small>
          </Link>

          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <span 
                  className="nav-link dropdown-toggle"
                  onClick={() => setIsOpen(prev => !prev)}
                  style={{ cursor: 'pointer' }}>
                  Shop
                </span>
                {isOpen && (
                  <>
                    <div className="dropdown-menu" ref={dropdownRef}>
                      <ul>
                        {shopDropdown.map((item, idx) => (
                          <li key={idx}>
                            <Link className="dropdown-item" to={item.to}>
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="dropdown-img">
                        <NavShopProduct />
                      </div>
                    </div>
                  </>
                )}
              </li>

              {navLinks.map((link, idx) => (
                <li key={idx} className={`nav-item ${location.pathname.startsWith(link.to) ? 'active' : ''}`}>
                  <Link to={link.to} className="nav-link">
                    {link.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          <div className="side">
              {isProfileOpen && (
                <div className="profile-dropdown-menu">
                  <ul>
                    {profileDropdown.map((item, idx) => (
                      <li key={idx}>
                        <Link className="dropdown-item" to={item.to} onClick={item?.onClick}>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sideLinks.map((link, idx) => (
                <div className="link-group" key={idx}>
                  <Link to={link.link} className="link" onClick={e => {
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                  }}>
                    <span className="icon">{link.icon}</span>
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
