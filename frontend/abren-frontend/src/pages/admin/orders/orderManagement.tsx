import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './ordermanagement.css';

const OrderManagement = () => {
  return (
    <div className="order-management">
      <h1>Order Manager</h1>
      <div className="tab-container">
        <Link to="/admin/orders" className='link'>Orders</Link>
        <Link to="/admin/orders/add" className='link'>Add Order</Link>
      </div>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default OrderManagement;
