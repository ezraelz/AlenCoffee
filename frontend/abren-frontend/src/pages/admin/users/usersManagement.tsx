import React, { useState } from 'react';
import './userManagement.css';
import UsersList from './usersList';
import UserCreate from './userCreate';

const UsersManagement = () => {
  const [activeTab, setActiveTab] = useState('Users');

  const tabs = ()=> {
    const buttons = [
      {name: 'Users'},
      {name: 'Add User'}
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
      case 'Users': return <UsersList/>;
      case 'Add User': return <UserCreate />;
      default: return <UsersList />;
    }
  }


  return (
    <div className='user-management'>
      <h1>User Mananger</h1>
      {tabs()}
      <div className="container">
        {renderContent()}
      </div>
    </div>
  )
}

export default UsersManagement
