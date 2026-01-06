import React, { useState } from 'react';
import crewData from '../data/crew.json';
import '../styles/Crew.css';

const Crew = () => {
  const initialTab = crewData.tabs.find(t => t.active)?.id || crewData.tabs[0].id;
  const [activeTab, setActiveTab] = useState(initialTab);

  const activeGroup = crewData.groups.find(g => g.id === activeTab);

  return (
    <section id="crew" className="crew-section">
      <div className="container">
        
        {/* Header */}
        <div className="crew-header">
          <span className="glass-tag">Organization</span>
          <h1 className="main-title">{crewData.title}</h1>
          <p className="sub-title">{crewData.description}</p>
        </div>

        {/* Navigation */}
        <div className="liquid-nav">
          {crewData.tabs.map((tab) => (
            <button
              key={tab.id}
              className={`liquid-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="crew-grid">
          {activeGroup && activeGroup.members.map((member, index) => (
            <div 
              key={`${activeTab}-${index}`} 
              className="liquid-card animate-enter"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              
              {/* Background Images */}
              <div className="card-bg-layer">
                 {/* Performance: decoding="async" tells browser to decode images non-blocking */}
                 <img 
                  src={member.image} 
                  alt={member.title} 
                  className="bg-img main-img"
                  loading="lazy"
                  decoding="async"
                />
                 {/* This second image is automatically hidden on mobile via CSS to save bandwidth */}
                 <img 
                  src={member.altImage} 
                  alt={`${member.title} Alt`} 
                  className="bg-img hover-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="card-overlay"></div>
              
              {/* Content */}
              <div className="card-content">
                <h3 className="card-title">
                  {member.subtitle || member.title}
                </h3>
                
                {member.subtitle && (
                  <span className="division-name">{member.title}</span>
                )}

                <div className="member-count">
                  {member.membersList.length} Members
                </div>
              </div>

              {/* Slide-up Details Panel */}
              <div className="details-glass">
                <h4>Roster</h4>
                <ul>
                  {member.membersList.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Crew;