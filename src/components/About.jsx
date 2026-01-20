// / src/components/About.jsx /
import React, { useEffect, useRef, useState } from 'react';
import { FiTarget, FiGlobe, FiCpu, FiAward, FiActivity } from 'react-icons/fi';
import '../styles/About.css';

const About = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Section Observer
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Spotlight Effect (Enhanced)
  useEffect(() => {
    if (isMobile) return;
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const cards = container.getElementsByClassName('bento-item');
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  return (
    <section id="about" className={`about-section ${isVisible ? 'is-visible' : ''}`} ref={sectionRef}>
      <div className="container">
        <div className="about-header">
          <span className="pill-badge reveal-item delay-1">Identity</span>
          <h2 className="reveal-item delay-2">Who We Are</h2>
        </div>

        <div className="bento-grid" ref={containerRef}>
          {/* Main Card */}
          <div className="bento-item main-card glass-panel reveal-item delay-3">
            <div className="spotlight-overlay"></div>
            <div className="content-inner">
              <div className="card-top">
                <span className="card-label">Est. 2025</span>
                <div className="icon-badge"><FiActivity /></div>
              </div>
              <div className="main-body">
                <h2 className="bento-heading">RECIS <br /><span className="text-highlight">SHS.</span></h2>
                <p className="bento-text">More than a school. We are a crucible for character, forging the next generation of leaders through academic rigor and compassion.</p>
              </div>
              <div className="stat-row">
                <div className="stat"><b>A+</b> <span>Accredited</span></div>
                <div className="stat"><b>100%</b> <span>Excellence</span></div>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bento-item vision-card glass-panel reveal-item delay-4">
            <div className="spotlight-overlay"></div>
            <div className="content-inner">
              <div className="card-icon"><FiTarget /></div>
              <h3>Our Vision</h3>
              <p className="vision-quote">"To become a premiere academic institution grounded in the spirit of FMM."</p>
              <div className="tags-container">
                <span className="tag">Excellence</span>
                <span className="tag">Integrity</span>
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bento-item mission-card glass-panel reveal-item delay-5">
            <div className="spotlight-overlay"></div>
            <div className="content-inner">
              <div className="mission-header">
                <h3>Mission Protocols</h3>
                <div className="divider-line"></div>
              </div>
              <ul className="mission-list">
                <li>
                  <div className="li-icon"><FiAward /></div>
                  <span>Academic Excellence</span>
                </li>
                <li>
                  <div className="li-icon"><FiGlobe /></div>
                  <span>Global Perspective</span>
                </li>
                <li>
                  <div className="li-icon"><FiCpu /></div>
                  <span>Tech Integration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;