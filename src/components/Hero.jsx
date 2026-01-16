// / src/components/Hero.jsx /
import React, { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiActivity, FiUsers, FiLayers } from 'react-icons/fi';
import '../styles/Hero.css';

const Hero = () => {
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="hero" 
      className={`hero-section ${isVisible ? 'is-visible' : ''}`} 
      ref={heroRef}
    >
      {/* No internal liquid-bg - using global fixed background */}
      
      <div className="container hero-container">
        {/* Text Content */}
        <div className="hero-text">
          <div className="reveal-item delay-1">
            <div className="pill-badge">
              <span className="pill-dot"></span>
              GO RECIS
            </div>
          </div>
          
          <h1 className="hero-title-home reveal-item delay-2">
            RECIS <br /> SHS.
          </h1>
          
          <p className="hero-desc reveal-item delay-3">
            Bridging the gap between abstract theory and tangible reality. 
            We cultivate disciplined creativity.
          </p>
          
          <div className="hero-actions reveal-item delay-4">
            <a href="#crew" className="btn btn-primary">
              Meet Our Crew
            </a>
            <a href="#about" className="btn btn-secondary">
              Our Mission <FiArrowRight className="icon-move" />
            </a>
          </div>
        </div>

        {/* Visual Stats */}
        <div className="hero-visual reveal-item delay-5">
          <div className="stat-card main-stat">
            <div className="stat-icon"><FiActivity /></div>
            <div className="stat-info">
              <h3>10+</h3>
              <p>Partners</p>
            </div>
          </div>
          
          <div className="stat-card float-1">
            <div className="stat-icon"><FiUsers /></div>
            <div className="stat-info">
              <h3>900+</h3>
              <p>Students</p>
            </div>
          </div>

          <div className="stat-card float-2">
            <div className="stat-icon"><FiLayers /></div>
            <div className="stat-info">
              <h3>15+</h3>
              <p>Clubs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;