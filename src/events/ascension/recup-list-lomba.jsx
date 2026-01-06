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
    {
      id: 1,
      title: "Basket",
      category: "sports",
      desc: "Kompetisi basket untuk tim putra dan putri tingkat pelajar.",
      img: "./assets/recup/comps/basket.jpg",
      date: "Hari ke-1",
      participants: "Tim",
      fee: "Rp 50.000 / tim"
    },
    {
      id: 2,
      title: "Futsal (SMP & SMA)",
      category: "sports",
      desc: "Turnamen futsal untuk siswa SMP dan SMA.",
      img: "./assets/recup/comps/futsal.jpg",
      date: "Hari ke-2",
      participants: "Tim",
      fee: "Rp 75.000 / tim"
    },
    {
      id: 3,
      title: "Voli",
      category: "sports",
      desc: "Lomba voli antar tim pelajar putra dan putri.",
      img: "./assets/recup/comps/voli.jpg",
      date: "Hari ke-2",
      participants: "Tim",
      fee: "Rp 50.000 / tim"
    },
    {
      id: 4,
      title: "Modern Dance",
      category: "arts",
      desc: "Tunjukkan kreativitas dan kekompakan melalui tarian modern.",
      img: "./assets/recup/comps/md.jpg",
      date: "Hari ke-1",
      participants: "Grup",
      fee: "Rp 40.000 / grup"
    },
    {
      id: 5,
      title: "E-Sport (Mobile Legends)",
      category: "sports",
      desc: "Turnamen Mobile Legends untuk tim pelajar.",
      img: "./assets/recup/comps/mole.jpeg",
      date: "Hari ke-3",
      participants: "Tim (5 orang)",
      fee: "Rp 100.000 / tim"
    },
    {
      id: 6,
      title: "Band",
      category: "arts",
      desc: "Kompetisi band untuk menampilkan bakat bermusik.",
      img: "./assets/recup/comps/band.jpg",
      date: "Hari ke-1",
      participants: "Grup",
      fee: "Rp 50.000 / band"
    },
    {
      id: 7,
      title: "Film Pendek",
      category: "arts",
      desc: "Lomba film pendek dengan tema bebas dan kreatif.",
      img: "./assets/recup/comps/sfilm.jpg",
      date: "Hari ke-3",
      participants: "Tim",
      fee: "Rp 30.000 / tim"
    },
    {
      id: 8,
      title: "KIR IPA",
      category: "academic",
      desc: "Kompetisi karya ilmiah remaja bidang IPA.",
      img: "./assets/recup/comps/kir.jpg",
      date: "Hari ke-2",
      participants: "Tim",
      fee: "Rp 25.000 / tim"
    },
    {
      id: 9,
      title: "Debat Bahasa Inggris",
      category: "academic",
      desc: "Lomba debat Bahasa Inggris untuk melatih berpikir kritis.",
      img: "./assets/recup/comps/debate.jpg",
      date: "Hari ke-3",
      participants: "Tim (3 orang)",
      fee: "Rp 30.000 / tim"
    }
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