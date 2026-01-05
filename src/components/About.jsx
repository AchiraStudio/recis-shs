import React, { useState } from 'react';
import { FiTarget, FiCheckCircle, FiZap } from 'react-icons/fi'; // Using icons for a polished look
import '../styles/About.css';

const About = () => {
  // State for the radial gradient mouse effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section id="about" className="about-section">
      <div className="container">
        {/* Header section from your Design 1 */}
        <div className="about-header">
          <span className="section-tag">Identity</span>
          <h2>Who We Are</h2>
        </div>

        <div className="bento-grid">
          {/* 1. HERO CARD (Merging "Main" from Design 1 with Content from Design 2) */}
          <div 
            className="bento-item main glass-panel"
            onMouseMove={handleMouseMove}
            style={{ '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` }}
          >
            <div className="bento-content-inner">
              <div className="bento-label">Identity</div>
              <h2 className="bento-heading">
                SMA Regina Pacis <br />
                <span className="outline-text">BOGOR</span>
              </h2>
              <p className="bento-text">
                Shaping the future through excellence, compassion, and integrity since 1948.
              </p>
            </div>
          </div>
          
          {/* 2. VISION CARD (Merging "Vision" from Design 1 with Content from Design 2) */}
          <div 
            className="bento-item vision glass-panel"
            onMouseMove={handleMouseMove}
            style={{ '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` }}
          >
             <div className="icon-box">👁️</div>
             <h3 className="card-h3">Vision</h3>
             <p className="vision-quote">
               "Menjadi Sekolah Menengah Atas bereputasi akademik unggul berlandaskan semangat FMM."
             </p>
             <div className="tags-row">
               <span>Academic</span><span>Global</span><span>Cultural</span>
             </div>
          </div>

          {/* 3. MISSION CARD (Merging "History" layout from Design 1 with Mission Content from Design 2) */}
          <div 
            className="bento-item mission glass-panel"
            onMouseMove={handleMouseMove}
            style={{ '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` }}
          >
            <div className="card-header">
               <h3 className="card-h3">Mission Protocols</h3>
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