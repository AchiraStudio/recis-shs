// / src/components/Hero.jsx /
import React, { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiPlayCircle, FiChevronDown, FiGlobe, FiAward, FiUsers } from 'react-icons/fi';
import heroBg from '../assets/hero-group.jpg';
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
      className={`hero-section ${isVisible ? 'hero-is-visible' : ''}`}
      ref={heroRef}
    >
      {/* Immersive Background */}
      <div className="hero-background-wrapper">
        <img src={heroBg} alt="RECIS Student Community" className="hero-bg-image" />
        <div className="hero-overlay-gradient"></div>
      </div>

      <div className="hero-content-container">

        {/* Top Label */}
        <div className="hero-top-label reveal-hero delay-hero-1">
          <span className="hero-label-line"></span>
          <span className="hero-label-text">EST. 2025 • THE FUTURE OF RSHS</span>
          <span className="hero-label-line"></span>
        </div>

        {/* Main Title Area */}
        <div className="hero-title-wrapper reveal-hero delay-hero-2">
          <h1 className="hero-big-title">
            OSIS <br />
            <span className="hero-outlined-text">2025/2026</span>
          </h1>
        </div>

        {/* Subtitle / Description */}
        <p className="hero-immersive-desc reveal-hero delay-hero-3">
          Join a vibrant community of scholars, innovators, and leaders using their talents to shape the future.
        </p>

        {/* Actions */}
        <div className="hero-immersive-actions reveal-hero delay-hero-4">
          <a href="#crew" className="hero-btn-glass-primary">
            <span>Meet The Crew</span>
            <div className="hero-btn-arrow"><FiArrowRight /></div>
          </a>
          <a href="#about" className="hero-btn-glass-secondary">
            <FiPlayCircle className="hero-play-icon" />
            <span>Our Story</span>
          </a>
        </div>

        {/* Floating Glass Cards (Bottom) */}
        <div className="hero-bottom-cards reveal-hero delay-hero-5">
          <div className="hero-glass-card">
            <div className="hero-card-icon"><FiGlobe /></div>
            <div className="hero-card-info">
              <span className="hero-card-val">Global</span>
              <span className="hero-card-label">Mindset</span>
            </div>
          </div>

          {/* Center card highlights the community aspect matching the photo */}
          <div className="hero-glass-card featured-card">
            <div className="hero-card-icon"><FiUsers /></div>
            <div className="hero-card-info">
              <span className="hero-card-val">900+</span>
              <span className="hero-card-label">Strong</span>
            </div>
          </div>

          <div className="hero-glass-card">
            <div className="hero-card-icon"><FiAward /></div>
            <div className="hero-card-info">
              <span className="hero-card-val">#1</span>
              <span className="hero-card-label">Innovation</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a href="#about" className="hero-scroll-indicator">
          <span>SCROLL</span>
          <FiChevronDown className="hero-scroll-arrow" />
        </a>

      </div>
    </section>
  );
};

export default Hero;