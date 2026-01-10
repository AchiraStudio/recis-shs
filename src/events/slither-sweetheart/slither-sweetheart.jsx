// slither-sweetheart.jsx
import React from 'react';
import { Sparkles, Heart, Star } from 'lucide-react';
import './css/style.css';

const SlitherSweetheart = () => {
  return (
    <div className="slither-wrapper">
      <div className="slither-bg-gradient"></div>
      
      <main className="slither-container">
        <div className="slither-header">
          <span className="slither-year">Year of the Snake</span>
          <span className="slither-heart">❤</span>
        </div>

        <div className="slither-content">
          <h1 className="slither-title">
            Prosperous <br />
            <span className="gold-text">Affection.</span>
          </h1>
          <p className="slither-text">
            Where traditional fortune meets modern romance. 
            A gala of red envelopes, roses, and refined elegance.
          </p>

          <div className="slither-grid">
            <div className="slither-box red">
              <Star className="icon" />
              <h3>CNY Gala</h3>
              <p>Lunar Dinners</p>
            </div>
            <div className="slither-box gold">
              <Heart className="icon" />
              <h3>Valentine</h3>
              <p>Sweet Soirée</p>
            </div>
          </div>

          <button className="slither-cta">
            <Sparkles size={16} /> Register Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default SlitherSweetheart;