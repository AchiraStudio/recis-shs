// JingleFooter.jsx
import React from 'react';
import { Instagram, Twitter, Mail, Heart } from 'lucide-react';
import './css/jingle-footer.css';

const JingleFooter = () => {
  return (
    <footer className="jingle-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Winter Elegance.</h3>
          <p>Regina Pacis Bogor</p>
        </div>
        
        <div className="footer-links">
          <a href="#schedule">Schedule</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-socials">
          <a href="#" className="social-icon"><Instagram size={20} /></a>
          <a href="#" className="social-icon"><Twitter size={20} /></a>
          <a href="#" className="social-icon"><Mail size={20} /></a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2025 Jingle Joyce. Achira Studios.</p>
      </div>
    </footer>
  );
};

export default JingleFooter;