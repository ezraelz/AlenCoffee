import React, { useState } from 'react';
import './productManagement.css';
import ProductList from './productList';
import ProductCreate from './productCreate';

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('List');

  const tabs = ()=> {
    const buttons = [
      {name: 'List'},
      {name: 'Add Product'}
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
      case 'List': return <ProductList/>;
      case 'Add Product': return <ProductCreate />;
      default: return <ProductList />;
    }
  }


  return (
    <div className='product-management'>
      <h1>Product Mananger</h1>
      {tabs()}
      <div className="container">
        {renderContent()}
      </div>
    </div>
  )
}

export default ProductManagement
