import React, { useState } from 'react';
import {
  FaArrowCircleRight,
  FaClipboardCheck,
  FaClock,
  FaFileInvoice,
  FaHome,
  FaProductHunt,
  FaUser
} from 'react-icons/fa';
import { FaArrowRightToCity, FaGear, FaBars } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  setSelectedComponent: (component: string) => void;
  selectedComponent: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedComponent, selectedComponent }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // controls sidebar open/close

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const links = [
    { name: 'Dashboard', icon: <FaClock /> },
    { name: 'Users', icon: <FaUser /> },
    { name: 'Products', icon: <FaProductHunt /> },
    { name: 'Orders', icon: <FaClipboardCheck /> },
    { name: 'Invoices', icon: <FaFileInvoice /> },
    { name: 'Blog', icon: <FaGear /> },
    { name: 'Help', icon: <FaArrowRightToCity /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <>
      {/* Toggle Button (always visible on small screen, optionally hidden on large) */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Backdrop on mobile */}
      {isOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Abren Coffee</h2>
        </div>
        <nav>
          <ul className="sidebar-links">
            {links.map((link) => (
              <li key={link.name}>
                <button
                  className={`sidebar-link ${selectedComponent === link.name ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedComponent(link.name);
                    setIsOpen(false); // close sidebar on small screen after selection
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
