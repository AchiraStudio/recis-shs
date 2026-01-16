// JingleGallery.jsx
import React from 'react';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import './css/jingle-gallery.css';

const JingleGallery = () => {
  return (
    <section className="jingle-section gallery-section">
      <div className="jingle-glow-spot right" />
      
      <div className="section-header">
        <h2 className="section-title">Captured Moments.</h2>
        <p className="section-desc">Glimpses of warmth from previous gatherings.</p>
      </div>

      <div className="gallery-grid">
        {/* Placeholders - replace src with real images */}
        <div className="gallery-item large">
          <div className="img-overlay" />
          <img src="/api/placeholder/600/400" alt="Event highlight main" />
        </div>
        <div className="gallery-item">
          <div className="img-overlay" />
          <img src="/api/placeholder/400/400" alt="Event highlight 1" />
        </div>
        <div className="gallery-item">
          <div className="img-overlay" />
          <img src="/api/placeholder/400/400" alt="Event highlight 2" />
        </div>
      </div>

      <div className="gallery-action">
        <button className="jingle-btn primary">
          View Full Gallery <ArrowRight size={18} className="btn-icon" />
        </button>
      </div>
    </section>
  );
};

export default JingleGallery;