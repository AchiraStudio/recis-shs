// jingle-joyce.jsx
import React from 'react';
import { Snowflake, Calendar, MapPin, ArrowRight } from 'lucide-react';
import './css/style.css';
import './css/sections.css'
import JingleSchedule from './jingle-schedule';
import JingleGallery from './jingle-gallery';
import JingleFooter from './jingle-footer';

const JingleJoyce = () => {
  return (
    <div className="jingle-wrapper">
      <section className="jingle-hero">
        <div className="jingle-ambient-glow" />
        <div className="jingle-content">
          <div className="jingle-badge">
            <Snowflake size={16} />
            <span>Seasonal Gathering</span>
          </div>
          <h1 className="jingle-title">Winter <br />Elegance.</h1>
          <p className="jingle-subtitle">
            A celebration of harmony and light amidst the cold season.
          </p>
          <div className="jingle-actions">
            <button className="jingle-btn primary">
              Reserve Seat <ArrowRight size={18} className="btn-icon" />
            </button>
            <button className="jingle-btn secondary">Learn More</button>
          </div>
        </div>
      </section>

      <section className="jingle-details">
        <div className="jingle-card">
          <Calendar className="card-icon" />
          <div className="card-text">
            <h3>December 20th</h3>
            <p>18:00 PM</p>
          </div>
        </div>
        <div className="jingle-card">
          <MapPin className="card-icon" />
          <div className="card-text">
            <h3>Main Hall</h3>
            <p>Regina Pacis Bogor</p>
          </div>
        </div>
      </section>

      <JingleSchedule></JingleSchedule>
      <JingleGallery></JingleGallery>
      <JingleFooter></JingleFooter>
    </div>
  );
};

export default JingleJoyce;