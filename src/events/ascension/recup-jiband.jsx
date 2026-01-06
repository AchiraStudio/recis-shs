import React from 'react';
import './css/jiband-greek.css';

const RecupGuestStar = () => {
  const guestStars = [
    { id: 1, name: "Renata", title: "Singer", image: "./assets/recup/renata.jpg", symbol: "α" },
    { id: 2, name: "Joshua", title: "Keys", image: "./assets/recup/joshua.jpg", symbol: "β" },
    { id: 3, name: "Lintang", title: "Drums", image: "./assets/recup/lintang.jpg", symbol: "γ" },
    { id: 4, name: "Levi", title: "Guitar", image: "./assets/recup/levi.png", symbol: "δ" },
    { id: 5, name: "Jairo", title: "Guitar", image: "./assets/recup/jairo.png", symbol: "ε" },
    { id: 6, name: "Jojosh", title: "Bass", image: "./assets/recup/jojosh.png", symbol: "ζ" }
  ];

  return (
    <section className="guest-section-greek" id="guest-star">
      <div className="parchment-bg-greek"></div>
      
      <div className="guest-container-greek">
        {/* Main Act */}
        <div className="headliner-card-greek">
          <div className="headliner-border-greek">
            <div className="hl-header-greek">
              <span className="hl-symbol-greek">Ω</span>
              <h1 className="hl-title-greek">THE HEADLINERS</h1>
              <span className="hl-symbol-greek">Ω</span>
            </div>
            
            <div className="hl-content-greek">
              <div className="hl-image-frame-greek">
                <img src="./assets/recup/jiband.jpg" alt="Jiband" className="hl-img-greek" />
                <div className="hl-ribbon-greek">JIBAND</div>
              </div>
              <div className="hl-info-greek">
                <p className="hl-desc-greek">"Voices that shake the pillars of Olympus."</p>
                <div className="hl-social-greek">@jiband_</div>
              </div>
            </div>
          </div>
        </div>

        {/* The Ensemble Grid */}
        <div className="ensemble-grid-greek">
          {guestStars.map(guest => (
            <div key={guest.id} className="member-card-greek">
              <div className="mc-top-greek">
                <span className="mc-symbol-greek">{guest.symbol}</span>
                <span className="mc-role-greek">{guest.title}</span>
              </div>
              <div className="mc-img-box-greek">
                <img src={guest.image} alt={guest.name} />
              </div>
              <h3 className="mc-name-greek">{guest.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecupGuestStar;