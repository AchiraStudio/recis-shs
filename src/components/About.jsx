// About.jsx
import React, { useEffect, useRef } from 'react';
import '../styles/About.css';

const About = () => {
  const containerRef = useRef(null);

  // Direct DOM manipulation for spotlight effect (High Performance)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return; // Disable on mobile
      const rect = container.getBoundingClientRect();
      container.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      container.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="container" ref={containerRef}>
        <div className="about-header">
          <span className="section-tag">Identity</span>
          <h2>Who We Are</h2>
        </div>

        <div className="bento-grid">
          <div className="bento-item main glass-panel">
            <div className="bento-label">Identity</div>
            <h2 className="bento-heading">SMA Regina Pacis <br /><span className="outline-text">BOGOR</span></h2>
            <p className="bento-text">Shaping the future through excellence, compassion, and integrity since 1948.</p>
          </div>
          
          <div className="bento-item vision glass-panel">
             <div className="icon-box">👁️</div>
             <h3>Vision</h3>
             <p className="vision-quote">"Menjadi Sekolah Menengah Atas bereputasi akademik unggul berlandaskan semangat FMM."</p>
             <div className="tags-row">
               <span>Academic</span><span>Global</span><span>Cultural</span>
             </div>
          </div>

          <div className="bento-item mission glass-panel">
            <div className="card-header">
               <h3>Mission Protocols</h3>
               <div className="header-line"></div>
            </div>
            <ul className="mission-stack">
              <li><span className="idx">01</span><span>Pendidikan unggul & berkualitas</span></li>
              <li><span className="idx">02</span><span>Karakter FMM</span></li>
              <li><span className="idx">03</span><span>Teknologi & Global</span></li>
              <li><span className="idx">04</span><span>Bakat & Budaya</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;