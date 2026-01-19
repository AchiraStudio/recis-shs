// easter-charity.jsx
import React, { useState, useEffect } from 'react';
import { Heart, HandHeart, Feather, ArrowDown, Leaf, Sun, Flower2 } from 'lucide-react';
import './css/style.css';

const EasterCharity = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  };

  return (
    <div className="easter-wrapper">
      {/* Decorative Background Elements */}
      <div className="easter-bg-bloom easter-bloom-1"></div>
      <div className="easter-bg-bloom easter-bloom-2"></div>
      <div className="easter-bg-bloom easter-bloom-3"></div>

      {/* Navigation */}
      <header className={`easter-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="easter-logo">
          <Flower2 size={24} className="easter-logo-icon" />
          <span>Regina Pacis</span>
        </div>
        <button className="easter-cta-sm">
          <span>Make a Donation</span>
          <Heart size={16} className="easter-btn-icon-sm" fill="currentColor" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="easter-hero">
        <div className="easter-hero-content">
          <div className="easter-floating-badge">
            <Sun size={18} /> Easter Charity 2025
          </div>
          <h1 className="easter-title">
            <span className="easter-reveal-text">Renewal</span>
            <span className="ampersand">&</span>
            <span className="easter-reveal-text highlight">Restoration</span>
          </h1>
          <p className="easter-desc">
            Embrace the season of new beginnings. Join us in bringing hope, warmth, and joy to those who need it most.
          </p>

          <div className="easter-hero-actions">
            <button className="easter-btn-primary">
              <HandHeart size={20} /> Join the Drive
            </button>
            <button className="easter-btn-secondary" onClick={scrollToContent}>
              Learn More
            </button>
          </div>
        </div>

        <div className="easter-hero-visual">
          <div className="easter-visual-circle">
            <div className="easter-image-wrapper">
              {/* Using a placeholder or the original image if available, using a nature/easter themed one */}
              <img src="https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?q=80&w=1000&auto=format&fit=crop" alt="Easter Charity" className="easter-hero-img" />
            </div>

            <div className="easter-floating-card easter-card-float-1">
              <span className="easter-card-label">Families Helped</span>
              <span className="easter-card-value">500+</span>
            </div>

            <div className="easter-floating-card easter-card-float-2">
              <Leaf size={20} className="easter-card-icon-leaf" />
              <span className="easter-card-value">Hope</span>
            </div>
          </div>
        </div>

        <div className="easter-scroll-arrow" onClick={scrollToContent}>
          <ArrowDown size={24} />
        </div>
      </section>

      {/* Impact Section */}
      <section className="easter-impact">
        <div className="easter-section-header">
          <h2>Our Mission</h2>
          <div className="easter-separator"></div>
        </div>

        <div className="easter-impact-grid">
          <div className="easter-impact-card">
            <div className="easter-icon-wrapper easter-color-rose">
              <Heart size={32} />
            </div>
            <h3>Compassion</h3>
            <p>Sharing love with the community through tangible acts of kindness.</p>
          </div>

          <div className="easter-impact-card">
            <div className="easter-icon-wrapper easter-color-amber">
              <Feather size={32} />
            </div>
            <h3>Renewal</h3>
            <p>Helping families start fresh with essential supplies and support.</p>
          </div>

          <div className="easter-impact-card">
            <div className="easter-icon-wrapper easter-color-teal">
              <Leaf size={32} />
            </div>
            <h3>Growth</h3>
            <p>Fostering a spirit of giving that grows within our students.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EasterCharity;