import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './ordermanagement.css';

const OrderManagement = () => {
   const [activeTab, setActiveTab] = useState('List');
    
      const renderTabs = () => {
        const buttons = [
          { name: 'List', to: '/admin/orders' },
          { name: 'Add Order', to: '/admin/orders/add'}
        ];
  
        return (
          <div className="tab-container">
            {buttons.map((button, index) => (
              <Link
                key={index}
                to={button.to}
                onClick={()=> setActiveTab(button.name)}
                className={activeTab === button.name ? 'link active' : 'link'}
              >
                {button.name}
              </Link>
            ))}
          </div>
        );
      };

  return (
    <div className="order-management">
      {renderTabs()}
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default OrderManagement;
