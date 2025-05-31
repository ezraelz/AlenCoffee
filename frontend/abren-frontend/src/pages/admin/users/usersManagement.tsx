import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './userManagement.css';

const UsersManagement = () => {
  return (
    <div className="user-management">
      <h1>User Manager</h1>
      <div className="tab-container">
        <Link to="/admin/users" className='link'>Users</Link>
        <Link to="/admin/users/add" className='link'>Add User</Link>
      </div>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default UsersManagement;
