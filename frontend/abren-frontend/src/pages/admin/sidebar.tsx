import React from 'react';
import {
    FaArrowCircleRight,
    FaClipboardCheck,
    FaClock,
    FaHome,
    FaUser
} from 'react-icons/fa';
import { FaArrowRightToCity, FaGear } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const links = [
        { name: 'Home', path: '/', icon: <FaHome /> },
        { name: 'Dashboard', path: '/admin/dashboard', icon: <FaClock /> },
        { name: 'Users', path: '/admin/users', icon: <FaUser /> },
        { name: 'Settings', path: '/admin/settings', icon: <FaGear /> },
        { name: 'Reports', path: '/admin/reports', icon: <FaClipboardCheck /> },
        { name: 'Help', path: '/admin/help', icon: <FaArrowRightToCity /> }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-hero">
                <h2>Abren Coffee</h2>
            </div>
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <Link to={link.path} className="sidebar-link">
                            {link.icon} {link.name}
                        </Link>
                    </li>
                ))}
                <li>
                    <button onClick={handleLogout} className="sidebar-link logout-button">
                        <FaArrowCircleRight /> Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
