import React from 'react';
import './Gifts.css'; // Make sure this file exists
import img from '../assets/images/bag-coffee-beans-bag-coffee-beans_962508-6092.jpg';
import img2 from '../assets/images/coffee-pack-design-minimal-white-background_1103290-1954.avif';
const Gifts = () => {
  return (
    <div className="gifts">
      <div className="gifts-container">
        <div className="gifts-hero">
            <h1 className="gifts-title">Perfect Coffee Gifts</h1>
            <p className="gifts-intro">
                Surprise your loved ones with curated coffee gifts that bring warmth, flavor, and joy to every cup.
            </p>
            <div className="gifts-img">
                <img src={img} alt="" className='img'/>
                <img src={img2} alt="" className='img'/>
                <img src={img} alt="" className='img'/>
            </div>
        </div>

        <div className="gift-grid">
          <div className="gift-card">
            <h2>Starter Gift Box</h2>
            <p>A handpicked selection of beans and a stylish mug. Perfect for new coffee enthusiasts.</p>
            <span className="gift-price">$29.99</span>
          </div>

          <div className="gift-card">
            <h2>Deluxe Coffee Set</h2>
            <p>Includes premium beans, a grinder, and accessories for the ultimate brew-at-home experience.</p>
            <span className="gift-price">$79.99</span>
          </div>

          <div className="gift-card">
            <h2>Digital Gift Card</h2>
            <p>Let them choose their favorite brew. Available in multiple denominations.</p>
            <span className="gift-price">From $10</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gifts;
