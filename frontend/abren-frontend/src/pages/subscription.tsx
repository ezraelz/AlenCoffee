import React from 'react';
import './Subscription.css'; // Make sure this matches your folder structure
import { Link } from 'react-router-dom';
import { FaCcAmazonPay, FaCcMastercard, FaCcPaypal, FaCcStripe, FaFacebook, FaInstagram, FaTiktok, FaTwitch } from 'react-icons/fa';
import { FaCcVisa, FaX } from 'react-icons/fa6';

const Subscription = () => {
  return (
    <div className="subscription">
      <div className="subscription-container">
        <div className="subscription-hero">
          <h1 className="subscription-title">Subscribe to Fresh Coffee</h1>
          <p className="subscription-intro">
            Enjoy our premium coffee delivered straight to your door every week or month. Choose a plan that suits your taste and schedule.
          </p>
          <div className="about-social">
            <Link to="https://www.facebook.com/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaCcMastercard aria-label="Facebook" />
            </Link>
            <Link to="https://www.instagram.com/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaCcVisa aria-label="Instagram" />
            </Link>
            <Link to="https://www.tiktok.com/@abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaCcAmazonPay aria-label="TikTok" />
            </Link>
            <Link to="https://www.twitch.tv/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaCcPaypal aria-label="Twitch" />
            </Link>
            <Link to="https://x.com/abren" className='social' target="_blank" rel="noopener noreferrer">
              <FaCcStripe aria-label="X (formerly Twitter)" />
            </Link>
          </div>
        </div>

        <div className="subscription-plans">
          <div className="plan-card">
            <h2>Weekly Plan</h2>
            <p>Fresh coffee delivered every week. Perfect for busy professionals and daily brewers.</p>
            <span className="price">$15/week</span>
          </div>

          <div className="plan-card">
            <h2>Monthly Plan</h2>
            <p>A curated selection of beans delivered once a month. Ideal for occasional coffee lovers.</p>
            <span className="price">$45/month</span>
          </div>

          <div className="plan-card">
            <h2>Office Plan</h2>
            <p>Keep the team fueled with bulk deliveries for your workspace or business.</p>
            <span className="price">Custom Quote</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;

