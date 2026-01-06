import React, { useState } from 'react';
import './css/tulus-greek.css';

const RecupSpecialPerformance = () => {
  const [active, setActive] = useState(0);
  
  const performances = [
    { id: 1, title: "THE MAESTRO", subtitle: "Tulus Live", img: "https://cms.disway.id/uploads/9ea2e21fa794b8bf8cc7f1f668f3440f.png", desc: "A symphony for the soul." },
    { id: 2, title: "THE LEGEND", subtitle: "Career", img: "https://media.suara.com/pictures/970x544/2022/03/17/39060-tulus-instagramattulusm.jpg", desc: "From architecture to auditory art." },
    { id: 3, title: "THE HITS", subtitle: "Top Songs", img: "https://cdn.antaranews.com/cache/1200x800/2022/12/01/Spotify-Wrapped-2022-Tulus_1.png", desc: "Hati-Hati di Jalan to Olympus." },
  ];

  return (
    <section className="tulus-section-greek" id="special-perf">
      {/* Dark Overlay over parchment */}
      <div className="dark-ink-overlay-greek"></div>
      
      <div className="tulus-container-greek">
        <div className="tulus-left-greek">
          <div className="tl-label-greek">SPECIAL GUEST STAR</div>
          <h2 className="tl-name-greek">TULUS</h2>
          <div className="tl-divider-greek"></div>
          
          <h3 className="active-title-greek">{performances[active].title}</h3>
          <p className="active-desc-greek">{performances[active].desc}</p>
          
          <div className="tulus-controls-greek">
            {performances.map((p, i) => (
              <button 
                key={p.id} 
                className={`dot-btn-greek ${active === i ? 'active' : ''}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
          
          <button className="reserve-btn-greek" onClick={() => window.open("https://kiostix.com/e/pentas-seni-recis-ascension")}>
            SECURE TICKETS
          </button>
        </div>

        <div className="tulus-right-greek">
          <div className="frame-gold-greek">
            <img src={performances[active].img} alt="Tulus" className="tr-img-greek" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecupSpecialPerformance;