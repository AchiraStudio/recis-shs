import React, { useState } from 'react';
import './css/competitions-greek.css';

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdlOBaqKPofTeWQV_mXpp1mxzLJFpX17ZyjLZzl8jV59ADqcg/viewform";

const RecupCompetitions = () => {
  const [activeCat, setActiveCat] = useState('all');
  
  // (Assuming same data structure as before, simplified for brevity)
  const categories = [
    { id: 'all', name: 'ALL GAMES' },
    { id: 'sports', name: 'ATHLETICS' },
    { id: 'arts', name: 'THE ARTS' },
    { id: 'academic', name: 'WISDOM' }
  ];
  
  // Mock data for display logic
  const competitions = [
     { id: 1, title: "Basketball", category: "sports", img: "./assets/recup/comps/basket.jpg", desc: "Prove your might on the court." },
     { id: 2, title: "Modern Dance", category: "arts", img: "./assets/recup/comps/md.jpg", desc: "Rhythm of the gods." },
     { id: 3, title: "Science Fair", category: "academic", img: "./assets/recup/comps/kir.jpg", desc: "Knowledge is power." },
     // ... add rest of data
  ];

  const filtered = activeCat === 'all' ? competitions : competitions.filter(c => c.category === activeCat);

  return (
    <section className="comp-section-greek">
      <div className="parchment-bg-greek"></div>
      
      <div className="comp-container-greek">
        <div className="comp-header-greek">
          <h2 className="ch-title-greek">THE GAMES</h2>
          <div className="ch-line-greek"></div>
        </div>

        {/* Scroll Tabs */}
        <div className="comp-tabs-greek">
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`tab-btn-greek ${activeCat === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* The Grid */}
        <div className="comp-grid-greek">
          {filtered.map(comp => (
            <div key={comp.id} className="decree-card-greek">
              <div className="decree-img-box-greek">
                <img src={comp.img} alt={comp.title} />
                <div className="decree-cat-badge-greek">{comp.category}</div>
              </div>
              
              <div className="decree-body-greek">
                <h3 className="decree-title-greek">{comp.title}</h3>
                <p className="decree-desc-greek">{comp.desc}</p>
                
                <a href={FORM_URL} target="_blank" rel="noreferrer" className="decree-seal-btn-greek">
                  <div className="seal-wax-greek">✍️</div>
                  <span>REGISTER</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecupCompetitions;