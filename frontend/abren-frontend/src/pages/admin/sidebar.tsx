import React, { useState } from 'react';
import {
  FaArrowCircleRight,
  FaClipboardCheck,
  FaClock,
  FaFileInvoice,
  FaProductHunt,
  FaUser,
} from 'react-icons/fa';
import { FaArrowRightToCity, FaGear, FaBars } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const links = [
    { name: 'Dashboard', icon: <FaClock />, path: '/admin/dashboard' },
    { name: 'Users', icon: <FaUser />, path: '/admin/users' },
    { name: 'Products', icon: <FaProductHunt />, path: '/admin/products' },
    { name: 'Orders', icon: <FaClipboardCheck />, path: '/admin/orders' },
    { name: 'Invoices', icon: <FaFileInvoice />, path: '/admin/invoices' },
    { name: 'Blog', icon: <FaGear />, path: '/admin/blog' },
    { name: 'Help', icon: <FaArrowRightToCity />, path: '/admin/help' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <>
      <button title='side-button' className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {isOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Abren Coffee</h2>
        </div>
        <nav>
          <ul className="sidebar-links">
            {links.map((link) => (
              <li key={link.name}>
                <button
                  className="sidebar-link"
                  onClick={() => {
                    navigate(link.path);
                    setIsOpen(false);
                  }}
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
    </>
  );
};

export default Sidebar;
