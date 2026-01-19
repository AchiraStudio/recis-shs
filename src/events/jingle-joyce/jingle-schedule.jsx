// JingleSchedule.jsx
import React from 'react';
import { Clock, Star, Music, GlassWater } from 'lucide-react';
import './css/jingle-schedule.css';

const scheduleData = [
  { time: '18:00', title: 'Arrival & Cocktails', desc: 'Warm cider and registration', icon: <Clock size={18} /> },
  { time: '19:00', title: 'Opening Toast', desc: 'Welcome by the Principal', icon: <GlassWater size={18} /> },
  { time: '19:30', title: 'Gala Dinner', desc: 'Fine dining experience', icon: <Star size={18} /> },
  { time: '21:00', title: 'Symphony', desc: 'Orchestra performance', icon: <Music size={18} /> },
];

const JingleSchedule = () => {
  return (
    <section className="jingle-section jingle-dark-glass" id="schedule">
      <div className="jingle-section-header">
        <span className="jingle-section-eyebrow">The Timeline</span>
        <h2 className="jingle-section-title">Evening Flow</h2>
        <div className="jingle-gold-separator"></div>
      </div>

      <div className="jingle-schedule-container">
        <div className="jingle-center-line"></div>

        {scheduleData.map((item, index) => (
          <div className={`jingle-schedule-item ${index % 2 === 0 ? 'left' : 'right'}`} key={index}>
            <div className="jingle-schedule-dot">
              <div className="jingle-dot-inner"></div>
            </div>

            <div className="jingle-schedule-content jingle-glass-card">
              <div className="jingle-time-badge">{item.time}</div>
              <h3 className="jingle-item-title">{item.title}</h3>
              <p className="jingle-item-desc">{item.desc}</p>
              <div className="jingle-item-icon-bg">{item.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JingleSchedule;