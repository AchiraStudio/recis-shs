import React from 'react';
import './css/footer-greek.css';

const RecupFooter = () => {
  return (
    <footer className="footer-greek">
      <div className="stone-texture-greek"></div>
      
      <div className="footer-container-greek">
        <div className="footer-brand-greek">
          <h2 className="fb-logo-greek">RECUP</h2>
          <p className="fb-tag-greek">Forged in 2026</p>
        </div>
        
        <div className="footer-cols-greek">
          <div className="fc-col-greek">
            <h4>EVENT</h4>
            <a href="#">Schedule</a>
            <a href="#">Map</a>
          </div>
          <div className="fc-col-greek">
            <h4>SOCIALS</h4>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </div>
      
      <div className="footer-base-greek">
        &copy; 2026 AchiraStudios. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};

export default RecupFooter;