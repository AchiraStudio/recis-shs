// Timeline.jsx
import React, { useEffect, useRef, useState } from 'react';
import { FiClock } from 'react-icons/fi';
import timelineData from '../data/timelineData.json';
import '../styles/Timeline.css';

function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  // Optimized Scroll Logic using IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            if (!isNaN(index)) setActiveIndex(index);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );
    itemsRef.current.forEach(item => item && observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const scrollToIndex = (index) => {
    if (itemsRef.current[index]) {
      itemsRef.current[index].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  };

  return (
    <section className="timeline-section" id="timeline">
      <div className="container timeline-layout">
        
        {/* Sidebar */}
        <div className="timeline-sidebar">
          <div className="sidebar-sticky">
            <span className="section-tag">Archive</span>
            <h2>Event<br />History</h2>
            <p>Swipe through our past celebrations and academic milestones.</p>
            <div className="timeline-controls">
               {/* Controls simplified for code brevity, hidden on mobile */}
               <button onClick={() => scrollToIndex(activeIndex - 1)} disabled={activeIndex === 0} className="control-btn">▲</button>
               <span>{activeIndex + 1}/{timelineData.length}</span>
               <button onClick={() => scrollToIndex(activeIndex + 1)} disabled={activeIndex === timelineData.length - 1} className="control-btn">▼</button>
            </div>
          </div>
        </div>

        {/* Track */}
        <div className="timeline-track-wrapper" ref={containerRef}>
          <div className="timeline-line"></div>
          <div className="timeline-nodes">
            {timelineData.map((event, index) => (
              <div
                key={event.id}
                className={`timeline-node ${index === activeIndex ? 'is-active' : ''}`}
                data-index={index}
                ref={el => itemsRef.current[index] = el}
                onClick={() => scrollToIndex(index)}
              >
                <div className="node-dot" style={{ background: event.color }} />
                <div className="glass-panel event-card">
                  <div className="card-bg-layer" style={{ backgroundImage: `url(${event.backgroundImage})` }}></div>
                  <div className="card-overlay"></div>
                  <div className="card-content-wrapper">
                    <div className="card-header">
                      <div className="event-icon-box" style={{ background: event.color }}><i className={event.icon}></i></div>
                      <span className="event-date-badge"><FiClock /> {event.date}</span>
                    </div>
                    <div className="card-body">
                      <span className="event-type">{event.type}</span>
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Timeline;