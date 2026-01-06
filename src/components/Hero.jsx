// Hero.jsx
import React from 'react';
import { FiArrowRight, FiActivity, FiUsers, FiLayers } from 'react-icons/fi';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      {/* Liquid Background (Subtle Blobs) */}
      <div className="liquid-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="container hero-container">
        <div className="hero-text">
          <div className="hero-pill">
            <span className="pill-dot"></span>
            GO RECIS
          </div>
          <h1 className="hero-title">
            RECIS <br />
            SHS.
          </h1>
          <p className="hero-desc">
            Bridging the gap between abstract theory and tangible reality. 
            We cultivate disciplined creativity.
          </p>
          
          <div className="hero-actions">
            <a href="#crew" className="btn btn-primary">
              Meet Our Crew
            </a>
            <a href="#about" className="btn btn-secondary">
              Our Mission <FiArrowRight />
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-widget main-widget">
            <div className="widget-icon"><FiActivity /></div>
            <h3>10+</h3>
            <p>University Partners</p>
          </div>
          
          <div className="glass-widget float-1">
            <div className="widget-icon"><FiUsers /></div>
            <h3>900+</h3>
            <p>Students</p>
          </div>

          <div className="glass-widget float-2">
            <div className="widget-icon"><FiLayers /></div>
            <h3>10+</h3>
            <p>Extracurricular</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;