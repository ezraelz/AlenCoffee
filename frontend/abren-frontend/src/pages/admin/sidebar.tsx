import React from 'react';

const Sidebar: React.FC = () => {
    // Sidebar component for the admin page
    // This component contains a list of navigation options for the admin user
    // You can add more options as needed
    // The sidebar is styled using CSS classes defined in sidebar.css
    // The sidebar is a functional component that returns a JSX element

    const links = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Users', path: '/admin/users' },
        { name: 'Settings', path: '/admin/settings' },
        { name: 'Reports', path: '/admin/reports' },
        { name: 'Logout', path: '/admin/logout' },
        { name: 'Help', path: '/admin/help' }
    ];

    return (
        <div className='sidebar'>
            <h2>Admin Sidebar</h2> {/* Move the header above the list */}
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <a href={link.path} className='sidebar-link'>{link.name}</a> {/* Display link name */}
                    </li>
                ))}
            </ul> {/* Close the ul tag here */}
        </div>
    );
};

export default Sidebar;