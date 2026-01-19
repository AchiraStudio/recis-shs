// JingleFooter.jsx
import React from 'react';
import { Instagram, Twitter, Mail } from 'lucide-react';
import './css/jingle-footer.css';

const JingleFooter = () => {
  return (
    <footer className="jingle-footer">
      <div className="jingle-border-t-gold"></div>
      <div className="jingle-footer-container">
        <div className="jingle-footer-left">
          <h2 className="jingle-footer-logo">Jingle Joyce</h2>
          <p>Regina Pacis Senior High School</p>
        </div>

        <div className="jingle-footer-right">
          <div className="jingle-social-links">
            <a href="#" className="jingle-social-item"><Instagram size={18} /></a>
            <a href="#" className="jingle-social-item"><Twitter size={18} /></a>
            <a href="#" className="jingle-social-item"><Mail size={18} /></a>
          </div>
          <p className="jingle-copyright">© 2024 Achira Studios. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default JingleFooter;