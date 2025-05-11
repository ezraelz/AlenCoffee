import React, { useState } from 'react';

const TopNav: React.FC = () => {
    const mainLinks = [
        { name: 'Language', path: '#' },
        { 
            name: 'User', 
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
                <h2>Admin Panel</h2>
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
