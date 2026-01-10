// easter-charity.jsx
import React from 'react';
import { Heart, HandHeart, Feather } from 'lucide-react';
import './css/style.css';

const EasterCharity = () => {
  return (
    <div className="easter-wrapper">
      <header className="easter-nav">
        <div className="easter-logo">RP Bogor</div>
        <button className="easter-cta-sm">Donate</button>
      </header>

      <section className="easter-hero">
        <div className="easter-left">
          <div className="easter-icon-box">
            <Feather size={32} className="easter-feather" />
          </div>
          <h1 className="easter-title">
            Rise & <br /> <span className="highlight">Restore.</span>
          </h1>
          <p className="easter-desc">
            Join our community in a spirit of renewal. This Easter, we gather to support those in need through compassion and collective action.
          </p>
          <div className="easter-metrics">
            <div>
              <span className="metric-val">500+</span>
              <span className="metric-label">Families</span>
            </div>
            <div>
              <span className="metric-val">100%</span>
              <span className="metric-label">Hope</span>
            </div>
          </div>
        </div>
        
        <div className="easter-right">
          <div className="easter-card-main">
            <div className="card-header">
              <Heart className="heart-icon" size={20} />
              <span>Charity Drive</span>
            </div>
            <h2>Give the Gift of Joy</h2>
            <p>Your contribution brings warmth to tables and smiles to faces this season.</p>
            <button className="easter-btn">
              <HandHeart size={18} /> Start Contributing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EasterCharity;