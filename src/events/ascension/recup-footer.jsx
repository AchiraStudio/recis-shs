import React from 'react';
import './css/footer-greek.css';
import { FaInstagram, FaTiktok, FaMapMarkerAlt, FaCalendarAlt, FaArrowUp } from "react-icons/fa";

const RecupFooter = () => {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="footer-overlay"></div>

      <div className="footer-container">

        {/* BRAND COLUMN */}
        <div className="fc-brand">
          <h2 className="fb-logo">RECUP</h2>
          <span className="fb-tag">FORGED IN MMXXVI</span>
          <p className="fb-desc">
            The grandest stage for the chosen ones.
            Ascend to greatness and leave your legacy in the halls of Olympus.
          </p>
        </div>

        {/* LINKS COLUMN */}
        <div className="fc-col">
          <h4>EXPLORE</h4>
          <a href="#" className="footer-link"><FaCalendarAlt size={14} /> Schedule</a>
          <a href="#" className="footer-link"><FaMapMarkerAlt size={14} /> Venue Map</a>
          <a href="#merch" className="footer-link">The Armory (Merch)</a>
        </div>

        {/* SOCIALS COLUMN */}
        <div className="fc-col">
          <h4>CONNECT</h4>
          <div className="social-grid">
            <a href="https://instagram.com/recisshs" target="_blank" rel="noreferrer" className="social-btn">
              <FaInstagram />
            </a>
            <a href="#" className="social-btn">
              <FaTiktok />
            </a>
          </div>
        </div>

      </div>

      {/* BOTTOM BASE */}
      <div className="footer-base">
        <span className="copyright">&copy; 2026 Achira Studios. ALL RIGHTS RESERVED.</span>

        <button className="totem-btn" onClick={scrollToTop} aria-label="Back to Top">
          <FaArrowUp />
        </button>

        <a href="#" className="achira-credit">
          POWERED BY ACHIRA STUDIOS
        </a>
      </div>
    </footer>
  );
};

export default RecupFooter;