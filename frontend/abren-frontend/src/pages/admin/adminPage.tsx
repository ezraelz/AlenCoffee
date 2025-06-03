import React, { useEffect, useState } from 'react';
import './sidebar.css';
import './topnav.css';
import './adminPage.css';
import '../../styles/admintabButtons.css';
import TopNav from './topnav';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useNavVisibility } from '../../context/NavVisibilityContext';
import axios from '../../utils/axios';

import {
  FaArrowCircleRight,
  FaCartPlus,
  FaClock,
  FaFileInvoice,
  FaHome,
  FaProductHunt,
  FaUser
} from 'react-icons/fa';
import { FaArrowRightToCity, FaGear } from 'react-icons/fa6';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setShowNav, setShowFooter } = useNavVisibility();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setShowNav(false);
    setShowFooter(false);
    return () => {
      setShowNav(true);
      setShowFooter(true);
    };
  }, [setShowNav, setShowFooter]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in.');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/users/me/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        } else {
          setError('Failed to load user.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (loading) return <div className="main">Verifying admin access...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  // Sidebar Component
  const Sidebar: React.FC = () => {
    const links = [
      { name: 'Dashboard', path: '/admin/overview', icon: <FaClock /> },
      { name: 'Users', path: '/admin/users', icon: <FaUser /> },
      { name: 'Products', path: '/admin/products', icon: <FaProductHunt /> },
      { name: 'Orders', path: '/admin/orders', icon: <FaCartPlus /> },
      { name: 'Invoices', path: '/admin/invoices', icon: <FaFileInvoice /> },
      { name: 'Blog', path: '/admin/blog', icon: <FaGear /> },
      { name: 'Help', path: '/admin/help', icon: <FaArrowRightToCity /> }
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
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
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

  return (
    <div className="admin-page">
      <TopNav />
      <Sidebar />
      {error && <div className="alert alert-danger w-100 text-center">{error}</div>}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
