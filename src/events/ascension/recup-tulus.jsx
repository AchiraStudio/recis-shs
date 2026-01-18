import React, { useState } from 'react';
import './css/tulus-greek.css';
import { FiArrowUpRight } from "react-icons/fi";

const RecupSpecialPerformance = () => {
  const [active, setActive] = useState(0);
  
  const chapters = [
    { 
      id: 0, 
      label: "THE MAESTRO", 
      title: "Human", 
      img: "https://sttpyiuqxevnrvxwywqk.supabase.co/storage/v1/object/public/images-tulus/tulus1.jpeg", 
      desc: "More than a singer, he is an architect of emotion. Tulus builds spaces with his voice where every listener feels at home." 
    },
    { 
      id: 1, 
      label: "THE JOURNEY", 
      title: "Gajah", 
      img: "https://sttpyiuqxevnrvxwywqk.supabase.co/storage/v1/object/public/images-tulus/tulus2.jpeg", 
      desc: "From humble beginnings to filling stadiums. A decade of storytelling that defines a generation of Indonesian music." 
    },
    { 
      id: 2, 
      label: "THE ANTHEM", 
      title: "Manusia", 
      img: "https://sttpyiuqxevnrvxwywqk.supabase.co/storage/v1/object/public/images-tulus/tulus3.jpeg", 
      desc: "Top charter across the archipelago. 'Hati-Hati di Jalan' isn't just a song; it's a farewell anthem for millions." 
    },
  ];

  return (
    <section className="tulus-section" id="special-perf">
      <div className="tulus-spotlight"></div>
      
      <div className="tulus-container">
        
        {/* LEFT CONTENT */}
        <div className="tulus-content">
          <div className="tl-label">SPECIAL PERFORMANCE</div>
          <h2 className="tl-name">TULUS</h2>
          
          {/* Chapter Tabs */}
          <div className="chapter-nav">
            {chapters.map((item, index) => (
              <button 
                key={item.id}
                className={`chapter-btn ${active === index ? 'active' : ''}`}
                onClick={() => setActive(index)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Dynamic Text */}
          <div className="active-content">
            <h3 className="ac-title">{chapters[active].title}</h3>
            <p className="ac-desc">{chapters[active].desc}</p>
          </div>

          <a 
            href="https://kiostix.com/e/pentas-seni-recis-ascension" 
            target="_blank" 
            rel="noreferrer" 
            className="ticket-btn"
          >
            SECURE TICKETS <FiArrowUpRight size={20}/>
          </a>
        </div>

        {/* RIGHT VISUAL */}
        <div className="tulus-visual">
          <div className="visual-aura"></div>
          <div className="visual-frame">
            <img 
              src={chapters[active].img} 
              alt="Tulus Live" 
              className="visual-img" 
            />
          </div>
          <div className="visual-deco">MMXXVI</div>
        </div>

      </div>
    </section>
  );
};

export default RecupSpecialPerformance;