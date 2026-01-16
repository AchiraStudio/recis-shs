import React, { useState } from 'react';
import './css/competitions-greek.css';
import { FiUsers, FiCalendar, FiArrowRight } from "react-icons/fi";

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdlOBaqKPofTeWQV_mXpp1mxzLJFpX17ZyjLZzl8jV59ADqcg/viewform";

const RecupCompetitions = () => {
  const [activeCat, setActiveCat] = useState('all');
  
  const categories = [
    { id: 'all', name: 'ALL' },
    { id: 'sports', name: 'ATHLETICS' },
    { id: 'arts', name: 'ARTS' },
    { id: 'academic', name: 'WISDOM' }
  ];
  
  const competitions = [
    {
      id: 1, title: "Basketball", category: "sports",
      desc: "5v5 Full Court. Prove your dominance on the hardwood.",
      img: "./assets/recup/comps/basket.jpg", date: "Day 1", fee: "50k"
    },
    {
      id: 2, title: "Futsal", category: "sports",
      desc: "Fast-paced action for Junior & Senior High teams.",
      img: "./assets/recup/comps/futsal.jpg", date: "Day 2", fee: "75k"
    },
    {
      id: 3, title: "Volleyball", category: "sports",
      desc: "Spike your way to victory. Men's & Women's division.",
      img: "./assets/recup/comps/voli.jpg", date: "Day 2", fee: "50k"
    },
    {
      id: 4, title: "Modern Dance", category: "arts",
      desc: "Choreography that tells a story. Show us your moves.",
      img: "./assets/recup/comps/md.jpg", date: "Day 1", fee: "40k"
    },
    {
      id: 5, title: "Mobile Legends", category: "sports",
      desc: "E-Sport tournament. 5v5 Draft Pick mode.",
      img: "./assets/recup/comps/mole.jpeg", date: "Day 3", fee: "100k"
    },
    {
      id: 6, title: "Band", category: "arts",
      desc: "Live music battle. Original songs or covers allowed.",
      img: "./assets/recup/comps/band.jpg", date: "Day 1", fee: "50k"
    },
    {
      id: 7, title: "Short Film", category: "arts",
      desc: "Cinematic storytelling. Theme: 'Ascension'.",
      img: "./assets/recup/comps/sfilm.jpg", date: "Day 3", fee: "30k"
    },
    {
      id: 8, title: "Science Fair", category: "academic",
      desc: "Scientific innovation competition for young minds.",
      img: "./assets/recup/comps/kir.jpg", date: "Day 2", fee: "25k"
    },
    {
      id: 9, title: "English Debate", category: "academic",
      desc: "Critical thinking and public speaking showdown.",
      img: "./assets/recup/comps/debate.jpg", date: "Day 3", fee: "30k"
    }
  ];

  const filtered = activeCat === 'all' ? competitions : competitions.filter(c => c.category === activeCat);

  return (
    <section className="comp-section">
      <div className="comp-container">
        
        <div className="comp-header">
          <span className="ch-subtitle">Choose Your Arena</span>
          <h2 className="ch-title">THE GAMES</h2>
        </div>

        {/* Filter Tabs */}
        <div className="comp-tabs">
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`tab-btn ${activeCat === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Competitions Grid */}
        <div className="comp-grid">
          {filtered.map(comp => (
            <div key={comp.id} className="game-card">
              <div className="gc-visual">
                <img src={comp.img} alt={comp.title} className="gc-img" />
                <div className="gc-badge">{comp.category}</div>
              </div>
              
              <div className="gc-content">
                <h3 className="gc-title">{comp.title}</h3>
                <p className="gc-desc">{comp.desc}</p>
                
                <div className="gc-meta">
                  <span><FiCalendar style={{marginRight:5}}/> {comp.date}</span>
                  <span>Fee: {comp.fee}</span>
                </div>

                {/* <a href={FORM_URL} target="_blank" rel="noreferrer" className="gc-btn">
                  REGISTER <FiArrowRight style={{marginLeft:5, verticalAlign:'middle'}}/>
                </a> */}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RecupCompetitions;