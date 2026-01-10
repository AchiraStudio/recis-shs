import React from "react";
import { IoMdClose } from "react-icons/io";

// --- HELPER COMPONENT: SMART TABS ---
const SmartTabs = ({ children, activeId, className = "", subTabs = false }) => {
  const containerRef = React.useRef(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const isOverflowing = el.scrollWidth > el.clientWidth;
    const atStart = Math.abs(el.scrollLeft) < 5;
    const atEnd = Math.abs(el.scrollLeft + el.clientWidth - el.scrollWidth) < 5;
    setShowLeft(isOverflowing && !atStart);
    setShowRight(isOverflowing && !atEnd);
  };

  const scroll = (direction) => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = 200; 
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (!activeId || !containerRef.current) return;
    const activeButton = Array.from(containerRef.current.children).find(
      child => child.getAttribute('data-id') === String(activeId)
    );
    if (activeButton) {
      setTimeout(() => {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 50);
    }
  }, [activeId]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      checkScroll(); 
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, [children]);

  return (
    <div className={`smart-tabs-wrapper ${subTabs ? 'sub' : ''} ${className}`}>
      <div className={`smart-tabs-mask left ${showLeft ? '' : 'hidden'}`}></div>
      <button className={`smart-tabs-arrow left ${showLeft ? 'visible' : ''}`} onClick={() => scroll('left')} aria-label="Scroll left">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <div ref={containerRef} className="smart-tabs-container">{children}</div>
      <div className={`smart-tabs-mask right ${showRight ? '' : 'hidden'}`}></div>
      <button className={`smart-tabs-arrow right ${showRight ? 'visible' : ''}`} onClick={() => scroll('right')} aria-label="Scroll right">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  );
};

// --- MAIN SCHEDULE COMPONENT ---
const RecupSchedule = ({
  groupedSchedules,
  activeTabDate,
  activeTabComp,
  setActiveTabDate,
  setActiveTabComp,
  onMatchClick,
  isBlacklistedFn,
  onClose
}) => {

  // --- FILTER LOGIC ---
  const getFilteredMatches = () => {
    if (!activeTabDate || !groupedSchedules[activeTabDate]) return [];
    const matchesOnDate = groupedSchedules[activeTabDate];
    if (activeTabComp === 'ALL') return matchesOnDate;
    return matchesOnDate.filter(m => m.competition === activeTabComp);
  };

  const filteredMatches = getFilteredMatches().filter(m => !isBlacklistedFn(m));
  const availableComps = activeTabDate && groupedSchedules[activeTabDate] 
    ? [...new Set(groupedSchedules[activeTabDate].map(m => m.competition))] 
    : [];

  // --- SPLIT LOGIC ---
  const liveMatches = filteredMatches.filter(m => m.status?.toLowerCase() === 'live');
  const nonLiveMatches = filteredMatches.filter(m => m.status?.toLowerCase() !== 'live').sort((a, b) => {
    const parseTime = (d, t) => new Date(`${d} ${t}`);
    return parseTime(a.date, a.time) - parseTime(b.date, b.time);
  });

  // --- RENDER HELPER ---
  const renderDecreeCard = (match, idx) => {
    const isLive = match.status?.toLowerCase() === 'live';
    const isUpcoming = (String(match.scoreteam1) === '-' || String(match.scoreteam2) === '-' || String(match.status).toLowerCase() === 'tbd');
    const shouldShowScore = !isUpcoming && (isLive || (match.scoreteam1 && match.scoreteam2));

    return (
      <div key={`${match.team1}-${match.team2}-${idx}`} className={`decree-card-greek ${match.status?.toLowerCase() === 'live' ? 'live' : (isUpcoming ? 'upcoming' : 'finished')}`} onClick={() => onMatchClick(match)}>
        <div className="dc-left-greek">
          <div className="dc-top-info-greek">
            <span className="dc-time-greek">{match.time}</span>
            <span className="dc-cat-greek">{match.competition}</span>
          </div>
          {shouldShowScore && (
            <span className={`dc-score-greek ${match.winner === 'team1' ? 'winner' : ''}`}>
              {match.scoreteam1}
            </span>
          )}
        </div>

        <div className="dc-center-greek">
          <div className="dc-team-greek">{match.team1}</div>
          <div className="dc-vs-greek">VS</div>
          <div className="dc-team-greek">{match.team2}</div>
          {match.stage && <div className="dc-stage-greek">{match.stage}</div>}
        </div>

        <div className="dc-right-greek">
          <div className="dc-top-info-greek">
            {isLive ? 
              <span className="live-tag-greek">LIVE</span> : 
              (isUpcoming ? 
                <span className="date-tag-greek" style={{color:'#d4af37', fontWeight:'bold'}}>UPCOMING</span> : 
                <span className="date-tag-greek">{match.date}</span>
              )
            }
          </div>
          {shouldShowScore && (
            <span className={`dc-score-greek ${match.winner === 'team2' ? 'winner' : ''}`}>
              {match.scoreteam2}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="parchment-modal-greek" onClick={e => e.stopPropagation()}>
      <div className="pm-header-greek">
        <h2>MATCH SCHEDULE</h2>
        <button className="pm-close-greek" onClick={onClose}><IoMdClose /></button>
      </div>

      <SmartTabs activeId={activeTabDate}>
        {Object.keys(groupedSchedules).map((date, idx) => (
          <button
            key={date}
            className={`pm-tab-greek ${activeTabDate === date ? 'active' : ''}`}
            onClick={() => { setActiveTabDate(date); setActiveTabComp('ALL'); }}
            data-id={date}
          >
            {date}
          </button>
        ))}
      </SmartTabs>

      <SmartTabs activeId={activeTabComp} subTabs={true}>
        <button
          className={`pm-subtab-greek ${activeTabComp === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTabComp('ALL')}
          data-id="ALL"
        >
          ALL MATCHES
        </button>
        {availableComps.map((comp, idx) => (
          <button
            key={comp}
            className={`pm-subtab-greek ${activeTabComp === comp ? 'active' : ''}`}
            onClick={() => setActiveTabComp(comp)}
            data-id={comp}
          >
            {comp}
          </button>
        ))}
      </SmartTabs>

      <div className="pm-body-greek">
        {filteredMatches.length > 0 ? (
          <>
            {/* --- DESKTOP SPLIT VIEW --- */}
            <div className="pm-desktop-split-greek">
              
              {/* LEFT COLUMN: LIVE ONLY (Conditional Render) */}
              {liveMatches.length > 0 && (
                <div className="pm-column-greek left-col">
                  <div className="pm-col-header-greek">
                    <span className="pm-header-dot live"></span>
                    <span className="pm-header-title">SEDANG BERLANGSUNG</span>
                  </div>
                  <div className="pm-col-scroll-area-greek">
                    <div 
                      className="pm-track-greek"
                      style={{ animation: liveMatches.length <= 2 ? 'none' : undefined }}
                    >
                       {liveMatches.length > 0 ? (
                          (liveMatches.length > 2 ? [...liveMatches, ...liveMatches] : liveMatches)
                            .map((match, idx) => renderDecreeCard(match, idx))
                       ) : (
                          <div className="loading-text-greek" style={{textAlign:'center', padding:'20px'}}>Tidak ada pertandingan live.</div>
                       )}
                    </div>
                  </div>
                </div>
              )}

              {/* CENTER DIVIDER (Conditional Render) */}
              {liveMatches.length > 0 && (
                <div className="pm-divider-vertical-greek"></div>
              )}

              {/* RIGHT COLUMN: NON-LIVE (Always Renders, Full Width if no Live) */}
              <div className={`pm-column-greek right-col ${liveMatches.length === 0 ? 'full-width' : ''}`}>
                <div className="pm-col-header-greek">
                  <span className={`pm-header-dot ${liveMatches.length > 0 ? 'upcoming' : 'all'}`}></span>
                  <span className="pm-header-title">{liveMatches.length > 0 ? 'JADWAL & HASIL' : 'SEMUA JADWAL'}</span>
                </div>
                <div className="pm-col-scroll-area-greek">
                  <div className="pm-track-greek">
                    {[...nonLiveMatches, ...nonLiveMatches].map((match, idx) => renderDecreeCard(match, idx))}
                  </div>
                </div>
              </div>

            </div>

            {/* --- MOBILE INFINITE VIEW (SCROLL) --- */}
            <div className="pm-infinite-scroll-wrapper-greek">
              <div className="pm-infinite-track-greek">
                {[...filteredMatches, ...filteredMatches].map((match, idx) => renderDecreeCard(match, idx))}
              </div>
            </div>
          </>
        ) : (
          <div className="loading-text-greek" style={{ textAlign: 'center', marginTop: '20px' }}>
            Tidak ada pertandingan yang ditampilkan.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecupSchedule;