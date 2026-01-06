// / src/components/Crew.jsx /
import React, { useState, useEffect, useRef } from 'react'; // FIXED IMPORT
import { FiUsers, FiChevronUp, FiInfo } from 'react-icons/fi';
import crewData from '../data/crew.json';
import '../styles/Crew.css';

const Crew = () => {
  const initialTab = crewData.tabs.find(t => t.active)?.id || crewData.tabs[0].id;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null); // ADDED
  const [isVisible, setIsVisible] = useState(false); // ADDED

  // 1. Section Scroll Observer (ADDED)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setExpandedCard(null);
  }, [activeTab]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeGroup = crewData.groups.find(g => g.id === activeTab);

  const handleCardClick = (index) => {
    if (!isMobile) return;
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section id="crew" className={`crew-section ${isVisible ? 'is-visible' : ''}`} ref={sectionRef}>
      {/* No internal liquid-bg */}
      
      <div className="container">
        <div className="crew-header">
          <span className="pill-badge reveal-item delay-1">Organization</span>
          <h1 className="main-title reveal-item delay-2">{crewData.title}</h1>
          <p className="sub-title reveal-item delay-3">{crewData.description}</p>
        </div>

        <div className="nav-wrapper reveal-item delay-4">
          <div className="liquid-nav">
            {crewData.tabs.map((tab) => (
              <button key={tab.id} className={`liquid-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="crew-grid">
          {activeGroup && activeGroup.members.map((member, index) => (
            <div 
              key={`${activeTab}-${index}`} 
              className={`liquid-card ${expandedCard === index ? 'is-expanded' : ''} reveal-item`}
              style={{ animationDelay: `${isMobile ? 0 : index * 0.1}s` }}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-bg-layer">
                 <img src={member.image} alt={member.title} className="bg-img main-img" loading="lazy" decoding="async" />
                 {!isMobile && (
                   <img src={member.altImage} alt="Alt View" className="bg-img hover-img" loading="lazy" decoding="async" />
                 )}
              </div>
              <div className="card-overlay"></div>
              <div className="mobile-hint"><FiInfo /> <span>Tap for Roster</span></div>
              <div className="card-content">
                <h3 className="card-title">{member.subtitle || member.title}</h3>
                {member.subtitle && <span className="division-name">{member.title}</span>}
                <div className="member-badge"><FiUsers /> {member.membersList.length}</div>
              </div>
              <div className="details-glass">
                <div className="details-header">
                  <h4>Roster List</h4>
                  <button className="close-btn" onClick={(e) => { e.stopPropagation(); setExpandedCard(null); }}>
                    <FiChevronUp style={{ transform: 'rotate(180deg)' }}/>
                  </button>
                </div>
                <ul className="roster-list">
                  {member.membersList.map((name, i) => (<li key={i}>{name}</li>))}
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