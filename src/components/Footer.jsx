// / src/components/Footer.jsx /
import React from 'react';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FiArrowUp, FiMapPin, FiMail } from 'react-icons/fi';
import '../styles/Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      {/* Decorative Background Text (Watermark) */}
      <div className="footer-bg-watermark">RECIS</div>

      <div className="container footer-container">

        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="brand-header">
            <div className="footer-badge">EST. 2025</div>
            <h2 className="footer-logo">RSHS.</h2>
          </div>
          <p className="brand-tagline">
            Forging character, defining futures. <br />
            An institution built for the visionaries of tomorrow.
          </p>

          <div className="contact-info">
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="contact-link">
              <FiMapPin className="c-icon" />
              <span>Jl. Ir. H. Juanda No.2, Bogor</span>
            </a>
            <a href="mailto:admissions@recis.sch.id" className="contact-link">
              <FiMail className="c-icon" />
              <span>admissions@recis.sch.id</span>
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="footer-col links-col">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About Legacy</a></li>
            <li><a href="#timeline">Our History</a></li>
            <li><a href="#crew">The Crew</a></li>
          </ul>
        </div>

        {/* Social / Connect Column */}
        <div className="footer-col social-col">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/recisshs/" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-btn">
              <FaInstagram />
            </a>
            <a href="https://www.tiktok.com/@recisshs" target="_blank" rel="noreferrer" aria-label="TikTok" className="social-btn">
              <FaTiktok />
            </a>
            <a href="#" aria-label="WhatsApp" className="social-btn">
              <FaWhatsapp />
            </a>
          </div>

          <div className="newsletter-mini">
            <span>Stay Updated</span>
            <div className="input-group">
              <input type="email" placeholder="Email Address" disabled />
              <button disabled>→</button>
            </div>
            <span className="tiny-note">Registration opens soon.</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-content">
          <div className="copyright">
            <span className="cp-text">© {new Date().getFullYear()} Achira Studios.</span>
            <span className="dot">•</span>
            <a href="/privacy" className="legal-link">Privacy</a>
            <span className="dot">•</span>
            <a href="/terms" className="legal-link">Terms</a>
          </div>

          <button onClick={scrollToTop} className="scroll-top-btn" aria-label="Scroll to top">
            <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;