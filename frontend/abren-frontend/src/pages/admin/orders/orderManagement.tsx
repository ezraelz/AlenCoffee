import React, { useState } from 'react';
import './ordermanagement.css';
import OrderList from './orderList';
import OrderCreate from './orderCreate';

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('List');

  const tabs = ()=> {
    const buttons = [
      {name: 'List'},
      {name: 'Add Order'}
    ]
    return(
      <div className="tab-container">
        {buttons.map((button)=>(
          <button onClick={()=> setActiveTab(button.name)}>{button.name}</button>
        ))}
      </div>
    )
  }

  const renderContent = () =>{
    switch(activeTab){
      case 'List': return <OrderList/>;
      case 'Add Product': return <OrderCreate />;
      default: return <OrderList />;
    }
  }


  return (
    <div className='order-management'>
      <h1>Order Mananger</h1>
      {tabs()}
      <div className="container">
        {renderContent()}
      </div>
    </div>
  )
}

export default OrderManagement
