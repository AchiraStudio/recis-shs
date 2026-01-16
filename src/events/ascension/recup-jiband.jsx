import React from 'react';
import './css/jiband-greek.css';
import { FaInstagram } from "react-icons/fa";

const RecupGuestStar = () => {
  // Use high-res images if possible
  const guestStars = [
    { id: 1, name: "Renata", title: "Vocals", image: "./assets/recup/renata.jpg", symbol: "α" },
    { id: 2, name: "Joshua", title: "Keys", image: "./assets/recup/joshua.jpg", symbol: "β" },
    { id: 3, name: "Lintang", title: "Percussion", image: "./assets/recup/lintang.jpg", symbol: "γ" },
    { id: 4, name: "Levi", title: "Strings", image: "./assets/recup/levi.png", symbol: "δ" },
    { id: 5, name: "Jairo", title: "Strings", image: "./assets/recup/jairo.png", symbol: "ε" },
    { id: 6, name: "Jojosh", title: "Bass", image: "./assets/recup/jojosh.png", symbol: "ζ" }
  ];

  return (
    <section className="gs-section" id="guest-star">
      <div className="gs-container">
        
        {/* HEADLINER BLOCK */}
        <div className="gs-headliner">
          
          {/* Visual Side */}
          <div className="hl-visual">
            <img src="./assets/recup/jiband.jpg" alt="Jiband" className="hl-img" />
            <div className="hl-badge">MAIN ACT</div>
          </div>

          {/* Content Side */}
          <div className="hl-content">
            <span className="hl-symbol">Ω</span>
            <span className="hl-subtitle">The Special Performance</span>
            <h1 className="hl-title">JIBAND</h1>
            <p className="hl-desc">
              "Echoes from the mountaintop. A symphony of modern rhythm and ancient soul that shakes the pillars of Olympus."
            </p>
            <a 
              href="https://instagram.com/jiband_" 
              target="_blank" 
              rel="noreferrer" 
              className="hl-social"
            >
              <FaInstagram style={{verticalAlign:'middle', marginRight:8}}/> 
              @jiband_
            </a>
          </div>
        </div>

        {/* ENSEMBLE GRID */}
        <div className="gs-grid">
          {guestStars.map(guest => (
            <div key={guest.id} className="member-card">
              <img src={guest.image} alt={guest.name} className="mc-bg" />
              <span className="mc-symbol">{guest.symbol}</span>
              
              <div className="mc-overlay">
                <span className="mc-role">{guest.title}</span>
                <h3 className="mc-name">{guest.name}</h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RecupGuestStar;