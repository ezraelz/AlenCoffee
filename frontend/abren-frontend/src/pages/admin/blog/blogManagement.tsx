import React, { useState } from 'react';
import './blogmanagement.css';
import BlogList from './blogList';
import BlogCreate from './blogCreate';

const BlogManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('List');

  const renderTabs = () => {
    const buttons = [
      { name: 'List' },
      { name: 'Add Blog' }
    ];
    return (
      <div className="tab-container">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(button.name)}
            className={activeTab === button.name ? 'active' : ''}
          >
            {button.name}
          </button>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'List':
        return <BlogList />;
      case 'Add Blog':
        return <BlogCreate key="create" />;
      default:
        return <BlogList />;
    }
  };

  return (
    <div className="blog-management">
      <h1>Blog Manager</h1>
      {renderTabs()}
      <div className="container">
        {renderContent()}
      </div>
    </div>
  );
};

export default BlogManagement;
