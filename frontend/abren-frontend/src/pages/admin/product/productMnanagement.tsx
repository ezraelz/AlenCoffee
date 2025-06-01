import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './productManagement.css';

const ProductManagement = () => {
  return (
    <div className="product-management">
      <h1>Product Manager</h1>
      <div className="tab-container">
        <Link to="/admin/products" className='link'>Products</Link>
        <Link to="/admin/products/add" className='link'>Add Product</Link>
      </div>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default ProductManagement;
