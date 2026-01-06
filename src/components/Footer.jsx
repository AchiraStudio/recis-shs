// / src/components/Footer.jsx /
import React from 'react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { FiArrowUp, FiMapPin, FiMail } from 'react-icons/fi';
import '../styles/Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      {/* Decorative Background Text */}
      <div className="footer-bg-text">RECIS</div>

      <div className="container footer-container">
        <div className="footer-col brand-col">
          <h2 className="footer-logo">RSHS.</h2>
          <p className="brand-tagline">Shaping character, defining futures.</p>
          <div className="contact-info">
            <div className="contact-item"><FiMapPin className="c-icon" /><span>Jl. Ir. H. Juanda No.2, Bogor</span></div>
            <div className="contact-item"><FiMail className="c-icon" /><span>admissions@recis.sch.id</span></div>
          </div>
        </div>

        <div className="footer-col links-col">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#timeline">History</a></li>
            <li><a href="#crew">Organization</a></li>
          </ul>
        </div>

        <div className="footer-col social-col">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/recisshs/#" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-btn"><FaInstagram /></a>
            <a href="https://www.tiktok.com/@recisshs" target="_blank" rel="noreferrer" aria-label="TikTok" className="social-btn"><FaTiktok /></a>
          </div>
          <div className="legal-links">
            <a href="/privacy">Privacy Policy</a>
            <span className="dot">•</span>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>© {new Date().getFullYear()} AchiraStudios.</p>
          <button onClick={scrollToTop} className="btn btn-secondary" style={{ padding: '8px 20px', height: 'auto', fontSize: '0.8rem' }} aria-label="Scroll to top">
            Back to Top <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;