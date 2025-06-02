import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './invoice.css';

const InvoiceManagement = () => {
  return (
    <div className="invoices-container">
      <h1>Invoice Manager</h1>
      <div className="tab-container">
        <Link to="/admin/invoices/" className='link'>Invoices</Link>
        <Link to="/admin/invoices/add" className='link'>Add Invoice</Link>
      </div>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default InvoiceManagement;
