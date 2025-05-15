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
  const { isLoggedIn, setIsLoggedIn} = useAuth();
  const [ role, setRole] = useState('');
  const [ username, setUsername] = useState('');
  const [ error, setError] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolledUp, setScrolledUp] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data.role);
        setRole(response.data.role);
        setUsername(response.data.username);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError(err);
      }
    };
  
    if (isLoggedIn) fetchRoleData();
  }, [isLoggedIn]);
  
  const handleScrollChange = () => {
    const currentScrollY = window.scrollY;
    setScrolledUp(currentScrollY > lastScrollY.current);
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollChange);
    return () => window.removeEventListener('scroll', handleScrollChange);
  }, []);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const dropdown = [
    { name: 'All Products', to: '/shop' },
    { name: 'Single Product', to: '/product/1' },
    { name: 'Cart', onClick: onCartClick  },
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

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  

  const navLinks = [
    { name: 'About AbrenCoffee', to: '/about' },
    { name: 'Services', to: '/services' },
    { name: 'Gifts', to: '/blog' },
    { name: 'Blog', to: '/blog' },
    { name: 'Menu', to: '/menu' },
    { name: 'Contact', to: '/contact' },
    { name: isLoggedIn ? 'Logout' : 'Login', to: '/login', onClick: handleLogout },
    { name: isLoggedIn ? '' : 'Subscribe', to: '/register',onClick: '' },
    { name: isLoggedIn && role === 'admin' ? 'Dashboard' : '', to: '/admin',onClick: '' },
   ] // Remove nulls
  
  const sideLinks = [
    { link: '/search', icon: <FaSearch /> },
    { link: '/profile', icon: <FaUser /> },
    { link: '#', icon: <FaShoppingCart />, onClick: onCartClick },
  ];

  console.log({isLoggedIn, role, username});

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
                  <div className="dropdown-menu" ref={dropdownRef}>
                    <ul>
                      {dropdown.map((li, index) => (
                        <li key={index}>
                          <Link className="dropdown-item" to={li.to} onClick={li?.onclick}>
                            {li.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>

              {navLinks.map((link, index) => (
                <li
                  key={index}
                  className={`nav-item ${isActive(link?.to) ? 'active' : ''}`}
                >
                  <Link to={link?.to} className="nav-link" onClick={link?.onClick}>
                    {link?.name}
                  </Link>
                </li>
              ))}

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
