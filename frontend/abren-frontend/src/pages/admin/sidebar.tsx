import React from 'react';
import {
  FaArrowCircleRight,
  FaCartPlus,
  FaClipboard,
  FaClock,
  FaFileInvoice,
  FaProductHunt,
  FaUser,
} from 'react-icons/fa';
import { FaArrowRightToCity, FaGear} from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Sidebar Component
const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const links = [
    { name: 'Dashboard', path: '/admin/overview', icon: <FaClock /> },
    { name: 'Users', path: '/admin/users', icon: <FaUser /> },
    { name: 'Products', path: '/admin/products', icon: <FaProductHunt /> },
    { name: 'Orders', path: '/admin/orders', icon: <FaCartPlus /> },
    { name: 'Invoices', path: '/admin/invoices', icon: <FaFileInvoice /> },
    { name: 'Blog', path: '/admin/blog', icon: <FaGear /> },
    { name: 'Report', path: '/admin/report', icon: <FaClipboard /> },
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

export default Sidebar;
