// JingleGallery.jsx
import React from 'react';
import { ArrowRight, Image } from 'lucide-react';
import './css/jingle-gallery.css';

const JingleGallery = () => {
  return (
    <section className="jingle-section" id="gallery">
      <div className="jingle-section-header">
        <span className="jingle-section-eyebrow">Memories</span>
        <h2 className="jingle-section-title">Captured Elegance</h2>
        <div className="jingle-gold-separator"></div>
      </div>

      <div className="jingle-gallery-grid">
        {/* Using placeholders, replacing with random elegant winter images */}
        <div className="jingle-gallery-card jingle-tall">
          <img src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=1000&auto=format&fit=crop" alt="Winter 1" />
          <div className="jingle-overlay"><span>Gala Night</span></div>
        </div>
        <div className="jingle-gallery-card jingle-wide">
          <img src="https://images.unsplash.com/photo-1576618148400-f54bed99fcf8?q=80&w=1000&auto=format&fit=crop" alt="Winter 2" />
          <div className="jingle-overlay"><span>Decorations</span></div>
        </div>
        <div className="jingle-gallery-card jingle-box">
          <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop" alt="Winter 3" />
          <div className="jingle-overlay"><span>Cocktails</span></div>
        </div>
        <div className="jingle-gallery-card jingle-box">
          <img src="https://images.unsplash.com/photo-1482517967863-00e15c9b4499?q=80&w=1000&auto=format&fit=crop" alt="Winter 4" />
          <div className="jingle-overlay"><span>Orchestra</span></div>
        </div>
      </div>

      <div className="jingle-center-action">
        <button className="jingle-link-btn">
          View Full Archive <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default JingleGallery;