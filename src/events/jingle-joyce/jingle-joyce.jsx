// jingle-joyce.jsx
import React, { useEffect, useState } from 'react';
import { Snowflake, ArrowRight } from 'lucide-react';
import './css/style.css';
import './css/sections.css';
import JingleSchedule from './jingle-schedule';
import JingleGallery from './jingle-gallery';
import JingleFooter from './jingle-footer';

const JingleJoyce = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="jingle-wrapper">
      <div className="jingle-noise-overlay"></div>

      {/* Hero Section */}
      <section className="jingle-hero">
        <div className="jingle-hero-bg" style={{ transform: `translateY(${offset * 0.5}px)` }}>
          <div className="jingle-aurora-glow"></div>
        </div>

        <div className="jingle-content">
          <div className="jingle-badge">
            <Snowflake size={14} className="jingle-spin-slow" />
            <span>Winter Gala 2024</span>
          </div>

          <h1 className="jingle-title">
            <span className="jingle-serif-font jingle-italic jingle-text-gold">Winter</span>
            <br />
            <span className="jingle-tracking-wide">Elegance</span>
          </h1>

          <p className="jingle-subtitle">
            An evening of harmony, light, and shared warmth amidst the season's chill.
          </p>

          <div className="jingle-actions">
            <button className="jingle-btn primary">
              <span>Reserve Presence</span>
              <div className="jingle-btn-glow"></div>
            </button>
            <button className="jingle-btn secondary">
              Details
            </button>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="jingle-floating-crystals">
          <div className="jingle-crystal jingle-c1"></div>
          <div className="jingle-crystal jingle-c2"></div>
          <div className="jingle-crystal jingle-c3"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="jingle-main">
        <JingleSchedule />
        <JingleGallery />
      </main>

      <JingleFooter />
    </div>
  );
};

export default JingleJoyce;