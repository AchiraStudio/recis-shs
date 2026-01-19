// slither-sweetheart.jsx
import React from 'react';
import { Sparkles, Heart, Star, Ticket, Scroll } from 'lucide-react';
import './css/style.css';

const SlitherSweetheart = () => {
  return (
    <div className="slither-wrapper">
      <div className="slither-bg-pattern"></div>

      {/* Floating Lanterns Decor */}
      <div className="lantern l1"></div>
      <div className="lantern l2"></div>
      <div className="lantern l3"></div>

      <main className="slither-main-card">
        <div className="ornament top-left"></div>
        <div className="ornament top-right"></div>
        <div className="ornament bottom-left"></div>
        <div className="ornament bottom-right"></div>

        <header className="slither-header">
          <div className="badge-year">
            <span className="snake-icon">🐍</span> THIS YEAR OF THE SNAKE
          </div>
          <h1 className="slither-title">
            Slither <span className="amp">&</span> <br />
            <span className="gradient-text">Sweetheart</span>
          </h1>
          <div className="separator-line">
            <span className="diamond">❖</span>
          </div>
        </header>

        <p className="slither-intro">
          We respectfully invite you to a gala of prosperity and romance.
          Experience the fusion of Lunar grandiosity and Valentine's charm.
        </p>

        <div className="event-options">
          <div className="option-card red-theme">
            <div className="card-icon"><Scroll strokeWidth={1.5} /></div>
            <h3>Lunar Gala</h3>
            <p>Traditional banquet & cultural showcase.</p>
            <span className="date">Feb 14, 18:00</span>
          </div>

          <div className="option-card pink-theme">
            <div className="card-icon"><Heart strokeWidth={1.5} /></div>
            <h3>Love Soirée</h3>
            <p>Modern romance & couple's dance.</p>
            <span className="date">Feb 14, 21:00</span>
          </div>
        </div>

        <button className="slither-cta">
          <Ticket className="ticket-icon" />
          <span>Purchase Invitation</span>
          <div className="shimmer"></div>
        </button>
      </main>
    </div>
  );
};

export default SlitherSweetheart;