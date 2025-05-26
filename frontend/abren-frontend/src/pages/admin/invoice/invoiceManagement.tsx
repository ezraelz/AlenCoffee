import React, { useState } from 'react'
import Invoices from './invoiceList';
import AddInvoice from './addInvoice';

const InvoiceManagement = () => {
  const [activeTab, setActiveTab] = useState('List');
  
    const tabs = ()=> {
      const buttons = [
        {name: 'List'},
        {name: 'Add Invoice'}
      ]
      return(
        <div className="tab-container">
          {buttons.map((button)=>(
            <button key={button.name} onClick={()=> setActiveTab(button.name)}>{button.name}</button>
          ))}
        </div>
      )
    }
  
    const renderContent = () =>{
      switch(activeTab){
        case 'List': return <Invoices/>;
        case 'Add Invoice': return <AddInvoice />;
        default: return <Invoices />;
      }
    }
  
  
    return (
      <div className='order-management'>
        <h1>Invoice Mananger</h1>
        {tabs()}
        <div className="container">
          {renderContent()}
        </div>
      </div>
    )
  }
  

export default InvoiceManagement
