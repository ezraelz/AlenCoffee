import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    date_joined: string;
}

const TopNav: React.FC = () => {
    const [user, setUser] = useState<User | null>();
    const mainLinks = [
        { name: 'Language', path: '#' },
        { 
            name: <FaUser />, 
            path: '#', 
            sublinks: [
                { name: 'Profile', path: '/admin/profile' },
                { name: 'Settings', path: '/admin/settings' },
                { name: 'Reports', path: '/admin/reports' },
                { name: 'Logout', path: '/admin/logout' },
                { name: 'Help', path: '/admin/help' },
            ],
        },
    ];

    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError("You must be logged in to view your profile.");
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
                    setError("Session expired. Please log in again.");
                    localStorage.removeItem('access_token');
                    navigate('/login');
                } else {
                    setError("Failed to load profile.");
                }
            }
        };

        fetchUserData();
    }, [navigate]);


    const handleDropdown = (index: number) => {
        if (openDropdown === index) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(index);
        }
    };

    return (
        <nav className="topnav">
            <div className="topnav-left">
                <h2>{user?.username}</h2>
            </div>
            <div className="topnav-right">
                <ul className="topnav-links">
                    {mainLinks.map((link, index) => (
                        <li key={index} className="topnav-item">
                            <a 
                                href={link.path} 
                                className="topnav-link" 
                                onClick={() => link.sublinks && handleDropdown(index)}
                            >
                                {link.name}
                            </a>
                            {link.sublinks && openDropdown === index && (
                                <ul className="topnav-sublinks">
                                    {link.sublinks.map((sublink, subIndex) => (
                                        <li key={subIndex} className="topnav-sublink-item">
                                            <a href={sublink.path} className="topnav-sublink-link">
                                                {sublink.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default TopNav;
