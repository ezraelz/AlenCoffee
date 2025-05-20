import React, { useEffect, useState } from 'react';
import './sidebar.css';
import './topnav.css';
import './adminPage.css';

import TopNav from './topnav';
import Overview from './overview';
import ProductManagement from './product/productMnanagement';

import axios from '../../utils/axios';
import { useNavVisibility } from '../../context/NavVisibilityContext';
import { useNavigate, Navigate } from 'react-router-dom';

import {
  FaArrowCircleRight,
  FaCartPlus,
  FaClock,
  FaHome,
  FaProductHunt,
  FaUser
} from 'react-icons/fa';
import { FaArrowRightToCity, FaGear } from 'react-icons/fa6';
import UsersManagement from './users/usersManagement';
import Blog from '../blog/blog';
import Help from './help/help';
import BlogManagement from './blog/blogManagement';
import OrderManagement from './orders/orderManagement';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  date_joined: string;
}

const AdminPage: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState('Dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { setShowNav, setShowFooter } = useNavVisibility();
  const navigate = useNavigate();

  useEffect(() => {
    setShowNav(false);
    setShowFooter(false);
    return () => {
      setShowNav(true);
      setShowFooter(true);
    };
  }, [setShowNav, setShowFooter]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        } else {
          setError('Failed to load user.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleMenuClick = (itemName: string) => {
    setSelectedComponent(itemName);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const componentMap: { [key: string]: JSX.Element } = {
    Dashboard: <Overview />,
    Products: <ProductManagement />,
    Users: <UsersManagement/>,
    Blog: <BlogManagement/>,
    Orders: <OrderManagement />,
    Help: <Help/>
  };

  const renderActiveTab = () => componentMap[selectedComponent] || <Overview />;

  if (loading) return <div className="main">Verifying admin access...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  // ------------------------
  // Inner Sidebar Component
  // ------------------------
  const Sidebar: React.FC = () => {
    const links = [
      { name: 'Home', icon: <FaHome /> },
      { name: 'Dashboard', icon: <FaClock /> },
      { name: 'Users', icon: <FaUser /> },
      { name: 'Products', icon: <FaProductHunt /> },
      { name: 'Orders', icon: <FaCartPlus/> }, 
      { name: 'Blog', icon: <FaGear /> },
      { name: 'Help', icon: <FaArrowRightToCity /> }
    ];

    return (
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Abren Coffee</h2>
        </div>
        <nav>
          <ul className="sidebar-links">
            {links.map((link) => (
              <li key={link.name}>
                <button
                  className={`sidebar-link ${selectedComponent === link.name ? 'active' : ''}`}
                  onClick={() => handleMenuClick(link.name)}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </button>
              </li>
            ))}
            <li>
              <button className="sidebar-link logout-button" onClick={handleLogout}>
                <FaArrowCircleRight />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    );
  };

  // ------------------------

  return (
    <div className="admin-page">
      <TopNav />
      <Sidebar />
      {error && <div className="alert alert-danger w-100 text-center">{error}</div>}
      {renderActiveTab()}
    </div>
  );
};

export default AdminPage;
