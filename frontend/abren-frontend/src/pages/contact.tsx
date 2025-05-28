import React from 'react';
import './contact.css'; // Make sure this path is correct

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1 className="contact-title">Contact Us</h1>
        <div className="contact-grid">
          <form className="contact-form">
            <label>
              <input type="text" placeholder="Your Name" />
            </label>
            <label>
              <input type="email" placeholder="you@example.com" />
            </label>
            <label>
              <textarea rows={5} placeholder="Your message..."></textarea>
            </label>
            <button type="submit">Send Message</button>
          </form>

          <div className="contact-info">
            <h2>Contact Info</h2>
            <p>Email: contact@example.com</p>
            <p>Phone: +1 (123) 456-7890</p>
            <p>Address: 123 Main Street, City, Country</p>

            <h2>Find Us</h2>
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=Statue%20of%20Liberty&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="contact-map"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
