import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About</h3>
          <p>We provide amazing services to make your life easier.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/monasteries">Blog</Link></li>
            <li><Link to="/contact">FAQs</Link></li>
            <li><Link to="/contact">Support</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@example.com</p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              <img src="/socialMediaIcon/facebook.png" alt="Facebook" style={{ width: 24, height: 24 }} />
            </a>
            <a href="#" aria-label="Twitter">
              <img src="/socialMediaIcon/twitter.png" alt="Twitter" style={{ width: 24, height: 24 }} />
            </a>
            <a href="#" aria-label="Instagram">
              <img src="/socialMediaIcon/instagram.png" alt="Instagram" style={{ width: 24, height: 24 }} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src="/socialMediaIcon/linkedin.png" alt="LinkedIn" style={{ width: 24, height: 24 }} />
            </a>
          </div>
        </div>
      </div>



      <div className="footer-bottom">
        © 2025 Monasteries. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;