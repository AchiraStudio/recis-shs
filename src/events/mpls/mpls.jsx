// mpls.jsx
import React from 'react';
import { ChevronRight, BookOpen, Users } from 'lucide-react';
import './css/style.css';

const Mpls = () => {
  return (
    <div className="mpls-wrapper">
      <div className="mpls-background">70</div>
      
      <main className="mpls-main">
        <p className="mpls-kicker">Regina Pacis Bogor</p>
        <h1 className="mpls-headline">
          The Next <br />
          <span className="mpls-gradient">Generation.</span>
        </h1>
        <p className="mpls-sub">
          Welcoming the new students of the 70th anniversary year. 
          Bold ideas, confident minds, and a future built on excellence.
        </p>

        <div className="mpls-hero-actions">
          <button className="mpls-btn-primary">
            Join Orientation <ChevronRight size={16} />
          </button>
        </div>

        <section className="mpls-bento">
          <div className="mpls-card">
            <div className="mpls-icon"><BookOpen /></div>
            <div className="mpls-info">
              <h4>Curriculum</h4>
              <p>Future-ready.</p>
            </div>
          </div>
          <div className="mpls-card">
            <div className="mpls-icon"><Users /></div>
            <div className="mpls-info">
              <h4>Community</h4>
              <p>Supportive.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Mpls;