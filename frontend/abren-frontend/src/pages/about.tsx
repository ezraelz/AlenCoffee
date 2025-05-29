import React from 'react';
import './About.css'; // Make sure this path is correct
import { FaFacebook, FaInstagram, FaTiktok, FaTwitch } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { FaUserFriends, FaHandshake, FaLightbulb } from 'react-icons/fa';
import value from '../assets/images/our-core-values.png';
import img1 from '../assets/images/cup-coffee-placed-table-some-scattered-coffee-beans-with-sheet-music-background_1_AUIWRs2.jpg';

import team1 from '../assets/images/customer.jpg';
import team2 from '../assets/images/happy.jpeg';

const About = () => {
  return (
    <div className="about">
      <div className="about-container">
        <div className="about-hero">
          <h1 className="about-title">About Abren</h1>
          <p className="about-description">
            Abren is a modern e-commerce platform dedicated to providing high-quality products and seamless shopping experiences. 
            We believe in innovation, reliability, and customer satisfaction.
          </p>
          <div className="about-social">
            <Link to="https://www.facebook.com/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaFacebook aria-label="Facebook" />
            </Link>
            <Link to="https://www.instagram.com/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaInstagram aria-label="Instagram" />
            </Link>
            <Link to="https://www.tiktok.com/@abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaTiktok aria-label="TikTok" />
            </Link>
            <Link to="https://www.twitch.tv/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaTwitch aria-label="Twitch" />
            </Link>
            <Link to="https://x.com/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaX aria-label="X (formerly Twitter)" />
            </Link>
          </div>
        </div>
        
        <div className="about-sections">
          <div className="about-card">
            <img src={img1} alt="" />
            <div className="about-card-detail">
              <h2>Coffee Production</h2>
              <p>
                To deliver premium products with exceptional service, using cutting-edge technology and sustainable practices.
              </p>
            </div>   
          </div>
          <div className="about-card-team">
            <div className="about-card-detail">
              <h2>Our Team</h2>
              <p>
                We are a group of developers, designers, and business strategists passionate about building great online experiences.
              </p>
            </div>
            <div className="about-card-team-img">
              <img src={team1} alt="" />
              <img src={team2} alt="" />
            </div>
          </div>
          <div className="about-card-values">
            <img src={value} alt="value" />
            <div className="values">
              <h2>Our Values</h2>
              <ul>
                <li><div className="icon"><FaUserFriends /></div>Customer-Centric Approach</li>
                <li> <div className="icon"><FaHandshake /></div>Integrity & Transparency</li>
                <li> <div className="icon"><FaLightbulb /></div>Innovation & Excellence</li>
              </ul>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default About;
