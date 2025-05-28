import React from 'react';
import './About.css'; // Make sure this path is correct

const About = () => {
  return (
    <div className="about">
      <div className="about-container">
        <h1 className="about-title">About Abren</h1>
        <p className="about-description">
          Abren is a modern e-commerce platform dedicated to providing high-quality products and seamless shopping experiences. 
          We believe in innovation, reliability, and customer satisfaction.
        </p>

        <div className="about-sections">
          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              To deliver premium products with exceptional service, using cutting-edge technology and sustainable practices.
            </p>
          </div>
          <div className="about-card">
            <h2>Our Team</h2>
            <p>
              We are a group of developers, designers, and business strategists passionate about building great online experiences.
            </p>
          </div>
          <div className="about-card">
            <h2>Our Values</h2>
            <ul>
              <li>Customer-Centric Approach</li>
              <li>Integrity & Transparency</li>
              <li>Innovation & Excellence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
