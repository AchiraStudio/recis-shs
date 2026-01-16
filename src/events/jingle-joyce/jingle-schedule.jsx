// JingleSchedule.jsx
import React from 'react';
import { Clock, Music, Utensils, Star } from 'lucide-react';
import './css/jingle-schedule.css';

const scheduleData = [
  { time: '18:00', title: 'Doors Open', desc: 'Welcome drinks & registration', icon: <Clock size={20} /> },
  { time: '18:45', title: 'Opening Remarks', desc: 'A warm welcome by the committee', icon: <Star size={20} /> },
  { time: '19:15', title: 'Dinner Service', desc: 'Gourmet dining experience', icon: <Utensils size={20} /> },
  { time: '20:30', title: 'Live Performance', desc: 'Orchestra & Choir harmony', icon: <Music size={20} /> },
];

const JingleSchedule = () => {
  return (
    <section className="jingle-section">
      <div className="jingle-glow-spot left" />
      
      <div className="section-header">
        <h2 className="section-title">The Evening.</h2>
        <p className="section-desc">A curated flow of events for the night.</p>
      </div>

      <div className="timeline-container">
        <div className="timeline-line" />
        {scheduleData.map((item, index) => (
          <div className="timeline-item" key={index}>
            <div className="timeline-marker">
              <div className="marker-dot" />
            </div>
            <div className="timeline-card">
              <div className="timeline-time">{item.time}</div>
              <div className="timeline-content">
                <div className="timeline-icon">{item.icon}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JingleSchedule;