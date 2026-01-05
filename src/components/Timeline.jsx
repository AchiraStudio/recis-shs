import React, { useEffect, useRef, useState } from 'react';
import { FiChevronUp, FiChevronDown, FiClock } from 'react-icons/fi';
import timelineData from '../data/timelineData.json'; // Assuming you put the JSON file here
import '../styles/Timeline.css';

function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  // 1. Handle Window Resize (Switch between Desktop Vertical / Mobile Horizontal)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Click to Scroll
  const scrollToIndex = (index) => {
    if (index < 0 || index >= timelineData.length) return;
    setActiveIndex(index);
    
    if (itemsRef.current[index]) {
      itemsRef.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Centers vertically (Desktop)
        inline: 'center' // Centers horizontally (Mobile)
      });
    }
  };

  // 3. Scroll Listener (Calculates which item is in the center)
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Determine the center point of the container
    const centerPoint = isMobile 
      ? container.scrollLeft + container.clientWidth / 2 
      : container.scrollTop + container.clientHeight / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    itemsRef.current.forEach((item, index) => {
      if (!item) return;
      
      // Calculate center of the item based on layout mode
      const itemRect = isMobile 
        ? item.offsetLeft + item.offsetWidth / 2 
        : item.offsetTop + item.offsetHeight / 2;
        
      const distance = Math.abs(centerPoint - itemRect);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  return (
    <section className="timeline-section" id="timeline">
      <div className="container timeline-layout">
        
        {/* --- HEADER / SIDEBAR --- */}
        <div className="timeline-sidebar">
          <div className="sidebar-sticky">
            <span className="section-tag">Archive</span>
            <h2 className="section-heading">Event<br />History</h2>
            <p className="sidebar-desc">
              Swipe through our past celebrations and academic milestones.
            </p>
            
            {/* Desktop Controls (Hidden on Mobile) */}
            <div className="timeline-controls">
              <button 
                className="nav-btn glass-btn" 
                onClick={() => scrollToIndex(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous Event"
              >
                <FiChevronUp />
              </button>
              
              <div className="nav-indicator">
                <span>{activeIndex + 1}</span><span className="divider">/</span>{timelineData.length}
              </div>
              
              <button 
                className="nav-btn glass-btn" 
                onClick={() => scrollToIndex(activeIndex + 1)}
                disabled={activeIndex === timelineData.length - 1}
                aria-label="Next Event"
              >
                <FiChevronDown />
              </button>
            </div>
          </div>
        </div>

        {/* --- SCROLLABLE TRACK --- */}
        <div 
          className="timeline-track-wrapper" 
          ref={containerRef} 
          onScroll={handleScroll}
        >
          {/* Vertical Line (Desktop Only) */}
          <div className="timeline-line"></div>
          
          <div className="timeline-nodes">
            {timelineData.map((event, index) => (
              <div
                key={event.id}
                className={`timeline-node ${index === activeIndex ? 'is-active' : ''}`}
                ref={el => itemsRef.current[index] = el}
                onClick={() => scrollToIndex(index)}
              >
                {/* Dot (Desktop Only) */}
                <div 
                  className="node-dot"
                  style={{ background: event.color }}
                />

                {/* The Card */}
                <div className="glass-panel event-card">
                  
                  {/* Background Image */}
                  <div 
                    className="card-bg-layer"
                    style={{ backgroundImage: `url(${event.backgroundImage})` }}
                  ></div>
                  
                  {/* Dark Overlay for Text Readability */}
                  <div className="card-overlay"></div>

                  {/* Content */}
                  <div className="card-content-wrapper">
                    <div className="card-header">
                      <div className="event-icon-box" style={{ background: event.color }}>
                        <i className={event.icon}></i>
                      </div>
                      <span className="event-date-badge">
                        <FiClock /> {event.date}
                      </span>
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