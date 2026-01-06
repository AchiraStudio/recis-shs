import { useState, useEffect } from "react";
import DynamicIsland from "../../components/DynamicI";
import "./css/recup-scroll.css"; 
// Keeping column css for other sections if needed
import "./css/recup-column.css";
import { GrSchedules } from "react-icons/gr";

// Sections
import RecupGuestStar from "./recup-jiband";
import RecupCompetitions from "./recup-list-lomba";
import RecupMerch from "./recup-merch";
import RecupFooter from "./recup-footer";
import RecupSpecialPerformance from "./recup-tulus";

const SCHEDULE_API =
  "https://script.google.com/macros/s/AKfycbxcR39xEqBTH8Rq8lAE2hLvZXKzwWOdG8LK0qqWm7m7kjyYlrm2QAHx2L2XxE-TRJQ3/exec";

function Recup() {
  const [matchSchedules, setMatchSchedules] = useState([]);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);

  // Change Title and logo
  useEffect(() => {
    document.title = "Ascension Cup - Official Website";

    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = "/assets/recup/favicon-recucp.png";
    }
  }, []);


  // --- 1. DATA FETCHING ---
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(SCHEDULE_API, { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data)) setMatchSchedules(data);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };
    fetchSchedule();
    const interval = setInterval(fetchSchedule, 20000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. PARALLAX LOGIC (Simplified for Performance) ---
  const handleMouseMove = (e) => {
    if (window.innerWidth <= 768) return; 

    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 2;
    const moveY = clientY - window.innerHeight / 2;
    
    const title = document.querySelector('.hero-title-greek');
    const clouds = document.querySelectorAll('.cloud-greek');

    if(title) title.style.transform = `translate(${moveX * 0.01}px, ${moveY * 0.01}px)`;
    
    clouds.forEach((cloud, i) => {
      const speed = (i + 1) * 0.02;
      cloud.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
    });
  };

  // --- 3. AUTO CYCLE WIDGET ---
  useEffect(() => {
    if (matchSchedules.length === 0) return;
    const interval = setInterval(() => {
      setActiveMatchIndex((prev) => (prev + 1) % matchSchedules.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [matchSchedules]);

  const activeMatch = matchSchedules[activeMatchIndex];

  return (
    <>
      <DynamicIsland theme="greek" />

      {/* === HERO WRAPPER === */}
      <div className="recup-scroll-wrapper-greek" onMouseMove={handleMouseMove}>
        
        {/* Parchment Texture Layer */}
        <div className="parchment-texture-greek"></div>
        <div className="vignette-greek"></div>

        {/* --- LEFT SIDEBAR: THE SCROLL WIDGET (Desktop) --- */}
        <div className="sidebar-left-greek">
          <div className="ancient-widget-greek">
            <div className="widget-header-greek">
              {/* <span className="wax-seal-greek">LIVE</span> */}
              <span className="header-text-greek">ASCENSION GAMES</span>
            </div>
            
            {matchSchedules.length > 0 ? (
              <div className="active-match-card-greek">
                <div className="am-bg-greek"></div>
                <div className="am-category-greek">{activeMatch?.category}</div>
                <div className="am-teams-greek">
                  <div className="am-team-greek">{activeMatch?.team1}</div>
                  <div className="am-vs-greek">
                    <span>VS</span>
                  </div>
                  <div className="am-team-greek">{activeMatch?.team2}</div>
                </div>
                <div className="am-status-greek">
                   {activeMatch?.status === 'live' ? '🔥 BATTLE IN PROGRESS' : '⏳ UPCOMING BATTLE'}
                </div>
              </div>
            ) : (
              <div className="loading-text-greek">Awaiting Scribes...</div>
            )}

            <div className="upcoming-list-greek">
              {matchSchedules.slice(0, 3).map((m, i) => (
                <div key={i} className="paper-row-greek">
                  <span className="pr-time-greek">{m.time}</span>
                  <span className="pr-match-greek">{m.team1} vs {m.team2}</span>
                </div>
              ))}
            </div>
            
            <button className="read-more-btn-greek" onClick={() => setIsScheduleOpen(true)}>
              UNFURL SCHEDULE
            </button>
          </div>
        </div>

        {/* --- CENTER: THE STAGE --- */}
        <section className="center-stage-greek">
          
          {/* Clouds */}
          <div className="clouds-container-greek">
            <img src="./assets/recup/cloud.webp" className="cloud-greek c1-greek" alt="" />
            <img src="./assets/recup/cloud.webp" className="cloud-greek c2-greek" alt="" />
          </div>

          {/* Title Area */}
          <div className="title-area-greek">
            <img src="./assets/recup/title.webp" className="hero-title-greek" alt="RECUP Title" />
            <div className="hero-year-greek">EST. MMXXVI</div>
          </div>

          {/* Building (Forcefully Anchored to Bottom) */}
          <div className="building-anchor-greek">
            <img src="./assets/recup/building.webp" className="hero-building-greek" alt="Pantheon" />
          </div>

          {/* Scroll Buttons (Floating above building) */}
          <div className="scroll-buttons-container-greek">
            <a href="#merch" className="scroll-btn-greek">
              <span className="scroll-handle-left"></span>
              <span className="scroll-content">GET MERCH</span>
              <span className="scroll-handle-right"></span>
            </a>
            <a href="#special-perf" className="scroll-btn-greek secondary-scroll-greek">
              <span className="scroll-handle-left"></span>
              <span className="scroll-content">GUEST STARS</span>
              <span className="scroll-handle-right"></span>
            </a>
          </div>
        </section>

        {/* --- RIGHT SIDEBAR: DECOR --- */}
        <div className="sidebar-right-greek">
          <div className="ornamental-border-greek"></div>
          <div className="vertical-text-greek">RECIS CUP 2026</div>
        </div>
      </div>

      {/* === MOBILE: WAX SEAL FAB & MODAL === */}
      <button 
        className="wax-fab-greek"
        onClick={() => setIsScheduleOpen(true)}
        aria-label="Open Schedule"
      >
        <div className="seal-inner-greek">
           <span className="seal-icon-greek"><GrSchedules /></span>
        </div>
        {matchSchedules.length > 0 && <span className="seal-badge-greek">{matchSchedules.length}</span>}
      </button>

      {/* Modal Overlay */}
      <div className={`parchment-modal-overlay-greek ${isScheduleOpen ? 'open-greek' : ''}`}>
        <div className="parchment-modal-greek">
          <div className="pm-header-greek">
            <h2>OFFICIAL DECREE</h2>
            <button className="pm-close-greek" onClick={() => setIsScheduleOpen(false)}>×</button>
          </div>
          <div className="pm-subheader-greek">SCHEDULE OF MATCHES</div>
          
          <div className="pm-body-greek">
             {matchSchedules.map((match, idx) => (
               <div key={idx} className={`decree-card-greek ${match.status}`}>
                  <div className="dc-left-greek">
                    <span className="dc-time-greek">{match.time}</span>
                    <span className="dc-cat-greek">{match.category}</span>
                  </div>
                  <div className="dc-center-greek">
                    <div className="dc-team-greek">{match.team1}</div>
                    <div className="dc-vs-greek">VS</div>
                    <div className="dc-team-greek">{match.team2}</div>
                  </div>
                  <div className="dc-right-greek">
                    {match.status === 'live' ? <span className="live-tag-greek">LIVE</span> : <span className="date-tag-greek">{match.date}</span>}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <RecupSpecialPerformance />
      <RecupGuestStar />
      <RecupCompetitions />
      <RecupMerch />
      <RecupFooter />
    </>
  );
}

export default Recup;