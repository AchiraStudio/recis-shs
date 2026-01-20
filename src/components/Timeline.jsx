// / src/components/Timeline.jsx /
import React, { useEffect, useRef, useState } from 'react';
import { FiClock, FiChevronDown, FiChevronUp, FiCalendar } from 'react-icons/fi';
import timelineData from '../data/timelineData.json';
import '../styles/Timeline.css';

const Timeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // SECTION ANIMATION
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

  // TIMELINE SCROLL OBSERVER
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Observer for internal container scroll
    const observerOptions = {
      root: container,
      rootMargin: "-45% 0px -45% 0px", // Trigger when element is near center
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.dataset.index);
          if (!isNaN(index)) setActiveIndex(index);
        }
      });
    }, observerOptions);

    itemsRef.current.forEach(item => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToIndex = (index) => {
    if (index >= 0 && index < timelineData.length && itemsRef.current[index]) {
      itemsRef.current[index].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      setActiveIndex(index);
    }
  };

  return (
    <section className={`timeline-section ${isVisible ? 'is-visible' : ''}`} id="timeline" ref={sectionRef}>
      <div className="container timeline-layout">

        {/* Sticky Sidebar */}
        <div className="timeline-sidebar">
          <div className="sidebar-sticky">
            <span className="section-tag reveal-item delay-1">Legacy</span>
            <h2 className="reveal-item delay-2">Our<br />Journey</h2>
            <p className="reveal-item delay-3">From humble beginnings to a legacy of excellence. Explore the milestones that define us.</p>

            <div className="timeline-controls reveal-item delay-4">
              <button onClick={() => scrollToIndex(activeIndex - 1)} disabled={activeIndex === 0} className="control-btn btn-glass" aria-label="Previous Event"><FiChevronUp /></button>
              <span className="control-count">{String(activeIndex + 1).padStart(2, '0')} <span className="divider">/</span> {String(timelineData.length).padStart(2, '0')}</span>
              <button onClick={() => scrollToIndex(activeIndex + 1)} disabled={activeIndex === timelineData.length - 1} className="control-btn btn-glass" aria-label="Next Event"><FiChevronDown /></button>
            </div>
          </div>
        </div>

        {/* Scrollable Track */}
        <div className="timeline-track-wrapper" ref={containerRef}>
          <div className="timeline-line-track">
            <div className="timeline-progress-bar" style={{ height: `${(activeIndex / (timelineData.length - 1)) * 100}%` }}></div>
          </div>

          <div className="timeline-nodes">
            {timelineData.map((event, index) => (
              <div
                key={event.id}
                className={`timeline-node ${index === activeIndex ? 'is-active' : ''} reveal-item`}
                data-index={index}
                style={{ transitionDelay: `${index * 0.1}s` }}
                ref={el => itemsRef.current[index] = el}
                onClick={() => scrollToIndex(index)}
              >
                {/* Node Indicator */}
                <div className="node-marker">
                  <div className="node-dot" style={{ borderColor: event.color, background: index === activeIndex ? event.color : 'transparent' }}></div>
                  <span className="node-date">{event.year || event.date.split(' ')[2]}</span>
                </div>

                {/* Event Card */}
                <div className="glass-panel event-card">
                  <div className="card-bg-layer" style={{ backgroundImage: `url(${event.backgroundImage})` }}></div>
                  <div className="card-overlay"></div>

                  <div className="card-content-wrapper">
                    <div className="card-header">
                      <div className="event-icon-box" style={{ background: `rgba(15, 23, 42, 0.6)`, color: event.color, border: `1px solid ${event.color}40` }}>
                        <i className={event.icon || 'ri-calendar-line'}></i>
                      </div>
                      <span className="event-date-badge"><FiCalendar /> {event.date}</span>
                    </div>

                    <div className="card-body">
                      <span className="event-type" style={{ color: event.color, textShadow: `0 0 10px ${event.color}40` }}>{event.type}</span>
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-desc">{event.description}</p>
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