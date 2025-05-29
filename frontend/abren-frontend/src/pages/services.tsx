import React from 'react';
import './Services.css'; // Make sure the path is correct

const Services = () => {
  return (
    <div className="services">
      <div className="services-container">
        <div className="service-hero">
          <h1 className="services-title">Our Services</h1>
          <p className="services-intro">
            At Abren, we offer a range of services tailored to meet your needs in digital commerce and technology.
          </p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <h2>Subscription</h2>
            <p>
              We build scalable and responsive websites using modern technologies like React, Django, and Node.js.
            </p>
          </div>

          <div className="service-card">
            <h2>Coffee for the office</h2>
            <p>
              Complete e-commerce platforms with payment integration, cart systems, order tracking, and more.
            </p>
          </div>

          <div className="service-card">
            <h2>Hot delivery</h2>
            <p>
              Beautiful, user-friendly interface design with a focus on usability, accessibility, and engagement.
            </p>
          </div>

          <div className="service-card">
            <h2>Coffee Production</h2>
            <p>
              Improve your online presence with search engine optimization and detailed analytics reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
