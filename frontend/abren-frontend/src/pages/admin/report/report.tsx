import React from 'react';
import './Report.css'; // Optional: create this file if you want to style it

const Report = () => {
  return (
    <div className="report-container">
      <h1 className="report-title">Reports & Analytics</h1>

      <div className="report-summary-grid">
        <div className="report-card">
          <h3>Total Sales</h3>
          <p>$12,340</p>
        </div>
        <div className="report-card">
          <h3>Orders</h3>
          <p>1,245</p>
        </div>
        <div className="report-card">
          <h3>New Subscriptions</h3>
          <p>89</p>
        </div>
        <div className="report-card">
          <h3>Refunds</h3>
          <p>$230</p>
        </div>
      </div>

      <div className="report-section">
        <h2>Monthly Sales Trend</h2>
        <p>📊 (Insert chart component here)</p>
      </div>

      <div className="report-section">
        <h2>User Engagement</h2>
        <p>📈 (Insert chart or table here)</p>
      </div>
    </div>
  );
};

export default Report;
