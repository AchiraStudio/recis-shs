// mpls.jsx
import React from 'react';
import { ArrowUpRight, Zap, Target, Shield, Rocket } from 'lucide-react';
import './css/style.css';

const Mpls = () => {
  return (
    <div className="mpls-wrapper">
      <div className="noise-bg"></div>

      {/* Marquee Header */}
      <div className="mpls-marquee-top">
        <div className="marquee-content">
          <span>REGINA PACIS HIGH SCHOOL</span>
          <span>EST. 1955</span>
          <span>EXCELLENCE REDEFINED</span>
          <span>FUTURE READY</span>
          <span>REGINA PACIS HIGH SCHOOL</span>
          <span>EST. 1955</span>
        </div>
      </div>

      <main className="mpls-main">
        <header className="mpls-hero-header">
          <div className="hero-badge">70TH ANNIVERSARY</div>
          <h1 className="mpls-title">
            THE NEXT <span className="stroke-text">GEN</span>
            <br />
            <span className="accent-text">EVOLUTION.</span>
          </h1>
          <p className="mpls-sub">
            Defy expectations. Build the future. Welcome to the orientation for the boldest generation yet.
          </p>

          <div className="mpls-cta-group">
            <button className="mpls-btn primary">
              REGISTER NOW <ArrowUpRight size={24} />
            </button>
            <button className="mpls-btn secondary">
              DOWNLOAD GUIDE
            </button>
          </div>
        </header>

        {/* Bento Grid Section */}
        <section className="mpls-grid-section">
          <div className="bento-grid">
            <div className="bento-box large box-1">
              <div className="box-icon"><Zap size={32} /></div>
              <h3>Dynamic<br />Learning</h3>
              <p>Curriculum designed for the digital age.</p>
            </div>

            <div className="bento-box box-2">
              <div className="box-icon"><Target size={32} /></div>
              <h3>Vision</h3>
            </div>

            <div className="bento-box box-3">
              <div className="box-icon"><Shield size={32} /></div>
              <h3>Integrity</h3>
            </div>

            <div className="bento-box wide box-4">
              <div className="box-content-row">
                <div className="box-text">
                  <h3>Student Life</h3>
                  <p>Beyond the classroom walls.</p>
                </div>
                <Rocket size={48} className="rocket-icon" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="mpls-side-decor">70</div>
    </div>
  );
};

export default Mpls;