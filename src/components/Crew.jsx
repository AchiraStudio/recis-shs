// / src/components/Crew.jsx /
import React, { useState, useEffect, useRef } from 'react';
import { FiUsers, FiChevronUp, FiInfo, FiAward } from 'react-icons/fi';
import crewData from '../data/crew.json';
import '../styles/Crew.css';

const Crew = () => {
  const initialTab = crewData.tabs.find(t => t.active)?.id || crewData.tabs[0].id;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Section Observer
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
    // On desktop, hover works. On mobile, click to expand.
    if (!isMobile) return;
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section id="crew" className={`crew-section ${isVisible ? 'is-visible' : ''}`} ref={sectionRef}>
      <div className="container">
        <div className="crew-header">
          <span className="pill-badge reveal-item delay-1">Organization</span>
          <h1 className="main-title reveal-item delay-2">{crewData.title || "The Crew"}</h1>
          <p className="sub-title reveal-item delay-3">{crewData.description}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-wrapper reveal-item delay-4">
          <div className="glass-nav">
            {crewData.tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="crew-grid" key={activeTab}>
          {activeGroup && activeGroup.members.map((member, index) => (
            <div
              key={`${activeTab}-${index}`}
              className={`member-card ${expandedCard === index ? 'is-expanded' : ''} reveal-item`}
              style={{ transitionDelay: `${index * 0.05}s` }}
              onClick={() => handleCardClick(index)}
            >
              {/* Background Image Layer */}
              <div className="card-image-wrapper">
                <img
                  src={member.image}
                  alt={member.title}
                  className="bg-img main-img"
                  loading="lazy"
                  decoding="async"
                />
                {/* Secondary image on hover if available */}
                {!isMobile && member.altImage && (
                  <img
                    src={member.altImage}
                    alt="Alt View"
                    className="bg-img hover-img"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="card-gradient-overlay"></div>
              </div>

              {/* Mobile Hint */}
              <div className="mobile-hint"><FiInfo /> <span>Tap for Details</span></div>

              {/* Default Content */}
              <div className="card-content-default">
                <div className="content-top">
                  <div className="division-badge"><FiAward /> {member.title.split(' ')[0]}</div>
                </div>
                <div className="content-bottom">
                  <h3 className="card-title">{member.subtitle || member.title}</h3>
                  <div className="member-count"><FiUsers /> {member.membersList.length} Members</div>
                </div>
              </div>

              {/* Expanded/Hover Details (Glass Overlay) */}
              <div className="details-overlay">
                <div className="details-header">
                  <h4>Roster</h4>
                  {isMobile && (
                    <button className="close-btn" onClick={(e) => { e.stopPropagation(); setExpandedCard(null); }}>
                      <FiChevronUp />
                    </button>
                  )}
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