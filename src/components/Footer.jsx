import React from 'react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        
        {/* Brand Column */}
        <div className="footer-section brand-section">
          <h2>RSHS</h2>
          <p>Excellence in Education.</p>
        </div>

        {/* Socials Column */}
        <div className="footer-section social-section">
          <h4>Connect</h4>
          <div className="social-icons">
            <a 
              href="https://www.instagram.com/recisshs/#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a 
              href="https://www.tiktok.com/@recisshs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="footer-section links-section">
          <h4>Quick Links</h4>
          <div className="links-wrapper">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>

      </div>
      
      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <p>© 2026 Achira Studios. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;