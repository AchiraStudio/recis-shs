import React, { useState, useEffect, useRef } from "react";
import DynamicIsland from "../../components/DynamicI"; 
import "./css/recup-scroll.css";
// --- ICONS ---
import { GrSchedules } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { GiScrollQuill, GiLaurels } from "react-icons/gi";

// --- SECTIONS ---
import RecupGuestStar from "./recup-jiband";
import RecupCompetitions from "./recup-list-lomba";
import RecupMerch from "./recup-merch";
import RecupFooter from "./recup-footer";
import RecupSpecialPerformance from "./recup-tulus";

const SCHEDULE_API = "https://script.google.com/macros/s/AKfycbxcR39xEqBTH8Rq8lAE2hLvZXKzwWOdG8LK0qqWm7m7kjyYlrm2QAHx2L2XxE-TRJQ3/exec";

// --- BLACKLIST SYSTEM (Sama seperti sebelumnya) ---
const NEWS_BLACKLIST = [
  { t1: "SF1 Loser", t2: "SF2 Loser" },
  { t1: "SF1 Winner", t2: "SF2 Winner" },
  { t1: "Tim A", t2: "Tim B" },
  { t1: "Tim C", t2: "Tim D" },
  { t1: "Tim E", t2: "Tim F" },
  { t1: "Tim G", t2: "Tim H" },
  { t1: "Tim 1", t2: "Tim 2" },
  { t1: "Tim 3", t2: "Tim 4" },
  { t1: "SMA Semifinal A Winner", t2: "SMA Semifinal B Winner" },
  { t1: "SMA Semifinal C Winner", t2: "SMA Semifinal D Winner" },
  { t1: "SMA Semifinal A Loser", t2: "SMA Semifinal B Loser" },
  { t1: "SMA Finalist 1", t2: "SMA Finalist 2" },
  { t1: "M2 Winner", t2: "M3 Winner" },
  { t1: "M1 Winner", t2: "M3 Loser" },
  { t1: "Semifinal 1 Loser", t2: "Semifinal 2 Loser" },
  { t1: "Semifinal 1 Winner", t2: "Semifinal 1 Winner" }
];

const checkIsBlacklisted = (match) => {
  if (!match.team1 || !match.team2) return false;
  const m1 = match.team1.toLowerCase().trim();
  const m2 = match.team2.toLowerCase().trim();
  return NEWS_BLACKLIST.some(block => {
    const b1 = block.t1.toLowerCase().trim();
    const b2 = block.t2.toLowerCase().trim();
    return (m1 === b1 && m2 === b2) || (m1 === b2 && m2 === b1);
  });
};

// --- NEWS TEMPLATES (Sama seperti sebelumnya) ---
const NEWS_TEMPLATES = {
  withScore: [
    (w, l, s) => `${w} melibas ${l} dengan skor telak ${s}!`,
    (w, l, s) => `Dominasi total! ${w} membungkam ${l} (${s}).`,
    (w, l, s) => `Kemenangan manis ${s} diraih oleh ${w}.`,
    (w, l, s) => `${w} tampil perkasa dan mengalahkan ${l} ${s}.`,
    (w, l, s) => `${l} tak berkutik saat ${w} menang ${s}.`,
    (w, l, s) => `Pesta gol! ${w} unggul atas ${l} dengan skor ${s}.`,
    (w, l, s) => `${w} memastikan kemenangan meyakinkan ${s} atas ${l}.`,
    (w, l, s) => `Laga sepihak! ${w} terlalu kuat untuk ${l} (${s}).`,
    (w, l, s) => `${w} menunjukkan kelasnya lewat kemenangan ${s}.`,
    (w, l, s) => `Hasil akhir ${s}, ${w} keluar sebagai pemenang.`
  ],
  noScore: [
    (w, l) => `${w} berhasil mengamankan kemenangan atas ${l}!`,
    (w, l) => `Sorak sorai untuk ${w} yang berhasil menang!`,
    (w, l) => `${w} tampil solid dan menundukkan ${l}.`,
    (w, l) => `Kemenangan penting diraih ${w} atas ${l}.`,
    (w, l) => `${l} harus mengakui keunggulan ${w}.`,
    (w, l) => `${w} sukses mengunci kemenangan di laga ini.`,
    (w, l) => `Langkah ${w} berlanjut setelah menang dari ${l}.`,
    (w, l) => `${w} keluar sebagai pemenang dalam duel ini.`,
    (w, l) => `Performa apik membawa ${w} menaklukkan ${l}.`,
    (w, l) => `${w} memastikan hasil positif melawan ${l}.`
  ],
  lossPerspective: [
    (w, l, s) => `${l} harus mengakui keunggulan ${w}${s ? ` (${s})` : ''}.`,
    (w, l, s) => `Hari yang berat bagi ${l} setelah dikalahkan ${w}.`,
    (w, l, s) => `${l} gagal membendung permainan ${w}.`,
    (w, l, s) => `Langkah ${l} terhenti oleh ${w}${s ? ` ${s}` : ''}.`,
    (w, l, s) => `${l} pulang dengan hasil pahit melawan ${w}.`,
    (w, l, s) => `Upaya ${l} belum cukup untuk menandingi ${w}.`,
    (w, l, s) => `${l} harus menerima kekalahan dari ${w}.`,
    (w, l, s) => `Bukan hari milik ${l} saat berhadapan dengan ${w}.`,
    (w, l, s) => `${l} tak mampu keluar dari tekanan ${w}.`,
    (w, l, s) => `Harapan ${l} pupus setelah tumbang dari ${w}.`
  ],
  draw: [
    (t1, t2, s) => `Sama kuat! ${t1} dan ${t2} berbagi angka ${s ? `(${s})` : ''}.`,
    (t1, t2, s) => `Kebuntuan tak terpecahkan antara ${t1} dan ${t2}.`,
    (t1, t2, s) => `Laga ketat berakhir imbang antara ${t1} dan ${t2}.`,
    (t1, t2, s) => `${t1} dan ${t2} harus puas dengan hasil seri.`,
    (t1, t2, s) => `Tak ada pemenang dalam duel ${t1} vs ${t2}.`,
    (t1, t2, s) => `Pertandingan seimbang, ${t1} kontra ${t2} berakhir imbang.`,
    (t1, t2, s) => `Skor akhir tak berubah, kedua tim berbagi poin.`,
    (t1, t2, s) => `${t1} gagal mengunci kemenangan, ${t2} mampu menyamakan.`,
    (t1, t2, s) => `Pertarungan sengit tanpa pemenang antara ${t1} dan ${t2}.`,
    (t1, t2, s) => `Hasil seri menjadi akhir laga ${t1} melawan ${t2}.`
  ],
  upcoming: [
    (t1, t2) => `Nantikan laga panas antara ${t1} melawan ${t2}!`,
    (t1, t2) => `Prediksi skor Anda untuk ${t1} vs ${t2}?`,
    (t1, t2) => `${t1} dan ${t2} siap berduel.`,
    (t1, t2) => `Laga seru akan terjadi: ${t1} vs ${t2}.`,
    (t1, t2) => `Pertandingan yang dinanti: ${t1} menghadapi ${t2}.`,
    (t1, t2) => `Siapakah yang akan unggul di ${t1} vs ${t2}?`,
    (t1, t2) => `Semua mata tertuju pada duel ${t1} kontra ${t2}.`,
    (t1, t2) => `Pertarungan besar segera hadir: ${t1} vs ${t2}.`,
    (t1, t2) => `${t1} menantang ${t2} dalam laga penuh gengsi.`,
    (t1, t2) => `Jangan lewatkan bentrokan ${t1} dan ${t2}!`
  ],
  staticTeasers: [
    { title: "Segera Dimulai", desc: "Upacara Pembukaan menanti pada 24 Januari." },
    { title: "Para Pejuang Siap", desc: "Tim-tim sedang mematangkan strategi mereka." },
    { title: "Ascension Cup", desc: "Siapa yang akan naik ke Olympus tahun ini?" },
    { title: "Catat Tanggalnya", desc: "24 Jan: Hari di mana bumi bergoncang." },
    { title: "Bersiaplah", desc: "Siapkan yel-yel kalian. Pertandingan makin dekat." },
    { title: "Menuju Puncak", desc: "Hanya yang terbaik yang akan bertahan." },
    { title: "Hitung Mundur", desc: "Detik-detik menuju turnamen akbar." },
    { title: "Arena Memanas", desc: "Atmosfer kompetisi semakin terasa." },
    { title: "Waktu Penentuan", desc: "Tak ada ruang untuk kesalahan." },
    { title: "Legenda Baru", desc: "Satu turnamen, satu sejarah baru." }
  ]
};

// --- HELPER COMPONENT: SMART TABS ---
const SmartTabs = ({ children, activeId, className = "", subTabs = false }) => {
  const containerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

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

  useEffect(() => {
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

  useEffect(() => {
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

// --- COMPONENT BARU: AUTO-SCROLL LIST ---
// Menangani scroll otomatis, loop seamless, dan pause-on-hover
const AutoScrollList = ({ matches, renderItem, className, speed = 0.5 }) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animationFrameId;
    let accumulator = 0;

    const scroll = () => {
      const el = containerRef.current;
      
      // Jika tidak di-hover dan element ada, jalankan auto-scroll
      if (el && !isHovered) {
        // Gunakan accumulator untuk kecepatan sub-pixel yang halus
        accumulator += speed;
        
        if (accumulator >= 1) {
          const pixelsToMove = Math.floor(accumulator);
          el.scrollTop += pixelsToMove;
          accumulator -= pixelsToMove;

          // LOGIKA SEAMLESS LOOP:
          // Karena data di-duplicate, jika scrollTop mencapai setengah dari total tinggi (tinggi data asli),
          // kita reset scrollTop ke 0. User tidak akan sadar karena kontennya identik.
          // Dikurangi clientHeight sedikit untuk safety buffer.
          if (el.scrollTop >= (el.scrollHeight / 2)) {
             el.scrollTop = 0; 
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, speed]);

  // Jika data terlalu sedikit untuk di-scroll, render biasa saja tanpa duplikasi
  if (matches.length < 3) {
      return (
        <div className={className} style={{ overflowY: 'auto' }}>
            <div className="pm-track-greek">
               {matches.map((m, i) => renderItem(m, i))}
            </div>
        </div>
      );
  }

  return (
    <div
      ref={containerRef}
      className={`${className} auto-scroller-active`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Touch start/end untuk support mobile touch-to-pause
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className="pm-track-greek">
        {/* Render Data PERTAMA */}
        {matches.map((match, idx) => renderItem(match, `orig-${idx}`))}
        
        {/* Render Data KEDUA (Duplikat untuk Seamless Loop) */}
        {matches.map((match, idx) => renderItem(match, `dup-${idx}`))}
      </div>
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

  const liveMatches = filteredMatches.filter(m => m.status?.toLowerCase() === 'live');
  const nonLiveMatches = filteredMatches.filter(m => m.status?.toLowerCase() !== 'live').sort((a, b) => {
    const parseTime = (d, t) => new Date(`${d} ${t}`);
    return parseTime(a.date, a.time) - parseTime(b.date, b.time);
  });

  const renderDecreeCard = (match, key) => {
    const isLive = match.status?.toLowerCase() === 'live';
    const isUpcoming = (String(match.scoreteam1) === '-' || String(match.scoreteam2) === '-' || String(match.status).toLowerCase() === 'tbd');
    const shouldShowScore = !isUpcoming && (isLive || (match.scoreteam1 && match.scoreteam2));

    return (
      <div key={key} className={`decree-card-greek ${match.status?.toLowerCase() === 'live' ? 'live' : (isUpcoming ? 'upcoming' : 'finished')}`} onClick={() => onMatchClick(match)}>
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
        {Object.keys(groupedSchedules).map((date) => (
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
        {availableComps.map((comp) => (
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
            {/* --- DESKTOP SPLIT VIEW (AUTO SCROLL + MANUAL ON HOVER) --- */}
            <div className="pm-desktop-split-greek">
              {liveMatches.length > 0 && (
                <div className="pm-column-greek left-col">
                  <div className="pm-col-header-greek">
                    <span className="pm-header-dot live"></span>
                    <span className="pm-header-title">SEDANG BERLANGSUNG</span>
                  </div>
                  {/* Gunakan AutoScrollList */}
                  <AutoScrollList 
                    className="pm-col-scroll-area-greek"
                    matches={liveMatches}
                    renderItem={renderDecreeCard}
                    speed={0.8} // Sedikit lebih cepat untuk live
                  />
                </div>
              )}

              {liveMatches.length > 0 && (
                <div className="pm-divider-vertical-greek"></div>
              )}

              <div className={`pm-column-greek right-col ${liveMatches.length === 0 ? 'full-width' : ''}`}>
                <div className="pm-col-header-greek">
                  <span className={`pm-header-dot ${liveMatches.length > 0 ? 'upcoming' : 'all'}`}></span>
                  <span className="pm-header-title">{liveMatches.length > 0 ? 'JADWAL & HASIL' : 'SEMUA JADWAL'}</span>
                </div>
                 {/* Gunakan AutoScrollList */}
                 <AutoScrollList 
                    className="pm-col-scroll-area-greek"
                    matches={nonLiveMatches}
                    renderItem={renderDecreeCard}
                    speed={0.6}
                  />
              </div>
            </div>

            {/* --- MOBILE VIEW (AUTO SCROLL + MANUAL ON HOVER) --- */}
             {/* Mobile hanya menggunakan satu list panjang */}
             <AutoScrollList 
                className="pm-mobile-scroll-wrapper-greek"
                matches={filteredMatches}
                renderItem={renderDecreeCard}
                speed={0.7}
              />
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

function Recup() {
  const [matchSchedules, setMatchSchedules] = useState([]);
  const [news, setNews] = useState(NEWS_TEMPLATES.staticTeasers);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const [groupedSchedules, setGroupedSchedules] = useState({});
  const [activeTabDate, setActiveTabDate] = useState('');
  const [activeTabComp, setActiveTabComp] = useState('ALL');

  useEffect(() => {
    document.title = "Ascension Cup - Official Website";
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) favicon.href = "/assets/recup/favicon-recucp.png";
  }, []);

  const generateNewsFromData = (data) => {
    let finalNews = [];
    const getWIBDate = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
      });
      return new Date(formatter.format(now));
    };

    const wibNow = getWIBDate();
    const wibHour = wibNow.getHours();

    const getMidnight = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const todayMidnight = getMidnight(wibNow);
    const yesterdayMidnight = new Date(todayMidnight);
    yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);
    const tomorrowMidnight = new Date(todayMidnight);
    tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

    let dateStart, dateEnd;
    if (wibHour < 18) {
      dateStart = yesterdayMidnight;
      dateEnd = todayMidnight;
    } else {
      dateStart = todayMidnight;
      dateEnd = tomorrowMidnight;
    }

    const isDateInRange = (matchDateString) => {
      const mDate = new Date(matchDateString);
      if (isNaN(mDate)) return false;
      const mMidnight = getMidnight(mDate);
      return mMidnight.getTime() === dateStart.getTime() || mMidnight.getTime() === dateEnd.getTime();
    };

    const relevantMatches = data.filter(m => {
      if (checkIsBlacklisted(m)) return false; 
      if (!isDateInRange(m.date)) return false;
      const isLive = m.status?.toLowerCase() === 'live';
      const score1 = String(m.scoreteam1).trim();
      const score2 = String(m.scoreteam2).trim();
      const statusStr = String(m.status).toLowerCase().trim();
      const isUpcoming = (score1 === '-' || score2 === '-' || statusStr === 'tbd');
      const hasResults = (score1 !== '-' && score2 !== '-' && m.winner && m.winner !== 'tbd');
      return isLive || hasResults || isUpcoming;
    });

    const sortedMatches = relevantMatches.sort((a, b) => {
      const aLive = a.status?.toLowerCase() === 'live';
      const bLive = b.status?.toLowerCase() === 'live';
      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;

      const aUpcoming = (String(a.scoreteam1) === '-' || String(a.scoreteam2) === '-' || String(a.status).toLowerCase() === 'tbd');
      const bUpcoming = (String(b.scoreteam1) === '-' || String(b.scoreteam2) === '-' || String(b.status).toLowerCase() === 'tbd');

      if (aUpcoming && !bUpcoming) return -1;
      if (!aUpcoming && bUpcoming) return 1;

      const parseTime = (d, t) => new Date(`${d} ${t}`);
      return parseTime(a.date, a.time) - parseTime(b.date, b.time);
    });

    const resultNews = sortedMatches.map(match => {
      const rawWinner = match.winner ? match.winner.toLowerCase().trim() : '';
      const scoreStr = `${match.scoreteam1}-${match.scoreteam2}`;
      const t1 = match.team1; const t2 = match.team2;
      const isMatchUpcoming = (String(match.scoreteam1) === '-' || String(match.scoreteam2) === '-' || String(match.status).toLowerCase() === 'tbd');

      let newsItem = {};
      if (isMatchUpcoming) {
        const idx = Math.floor(Math.random() * NEWS_TEMPLATES.upcoming.length);
        newsItem = { title: "Segera Hadir", desc: NEWS_TEMPLATES.upcoming[idx](t1, t2) };
      } else if (rawWinner === 'draw' || (match.scoreteam1 === match.scoreteam2)) {
        const idx = Math.floor(Math.random() * NEWS_TEMPLATES.draw.length);
        newsItem = { title: "Hasil Imbang", desc: NEWS_TEMPLATES.draw[idx](t1, t2, scoreStr) };
      } else {
        let winnerName = rawWinner;
        let loserName = 'Lawan';
        if (rawWinner === 'team1') { winnerName = t1; loserName = t2; }
        else if (rawWinner === 'team2') { winnerName = t2; loserName = t1; }
        else {
          if (rawWinner === t1.toLowerCase()) { winnerName = t1; loserName = t2; }
          else if (rawWinner === t2.toLowerCase()) { winnerName = t2; loserName = t1; }
        }

        const variantType = Math.floor(Math.random() * 3);
        if (variantType === 0) {
          const idx = Math.floor(Math.random() * NEWS_TEMPLATES.withScore.length);
          newsItem = { title: "Laporan Laga", desc: NEWS_TEMPLATES.withScore[idx](winnerName, loserName, scoreStr) };
        } else if (variantType === 1) {
          const idx = Math.floor(Math.random() * NEWS_TEMPLATES.lossPerspective.length);
          newsItem = { title: "Pasca Laga", desc: NEWS_TEMPLATES.lossPerspective[idx](winnerName, loserName, scoreStr) };
        } else {
          const idx = Math.floor(Math.random() * NEWS_TEMPLATES.noScore.length);
          newsItem = { title: "Kabar Kemenangan", desc: NEWS_TEMPLATES.noScore[idx](winnerName, loserName) };
        }
      }
      return newsItem;
    });

    finalNews = [...finalNews, ...resultNews];
    if (finalNews.length === 0) {
      setNews(NEWS_TEMPLATES.staticTeasers);
    } else {
      setNews(finalNews);
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(SCHEDULE_API);
        const data = await res.json();

        if (Array.isArray(data)) {
          const parseDate = (d, t) => new Date(`${d} ${t}`);
          const sortedData = data.sort((a, b) => parseDate(a.date, a.time) - parseDate(b.date, a.time));

          setMatchSchedules(sortedData);
          generateNewsFromData(sortedData);

          const groups = {};
          sortedData.forEach(match => {
            if (!groups[match.date]) {
              groups[match.date] = [];
            }
            groups[match.date].push(match);
          });

          Object.keys(groups).forEach(date => {
            groups[date].sort((a, b) => {
              const aLive = a.status?.toLowerCase() === 'live';
              const bLive = b.status?.toLowerCase() === 'live';
              const aUpcoming = (String(a.scoreteam1) === '-' || String(a.scoreteam2) === '-' || String(a.status).toLowerCase() === 'tbd');
              const bUpcoming = (String(b.scoreteam1) === '-' || String(b.scoreteam2) === '-' || String(b.status).toLowerCase() === 'tbd');
              if (aLive && !bLive) return -1;
              if (!aLive && bLive) return 1;
              if (aUpcoming && !bUpcoming) return -1;
              if (!aUpcoming && bUpcoming) return 1;
              return a.time.localeCompare(b.time);
            });
          });

          setGroupedSchedules(groups);

          setActiveTabDate(prev => {
            if (!prev) {
              const dates = Object.keys(groups);
              return dates.length > 0 ? dates[0] : '';
            }
            return prev;
          });
        }
      } catch (err) { console.error("API Error", err); }
    };

    fetchSchedule();
    const interval = setInterval(fetchSchedule, 30000);
    return () => clearInterval(interval);

  }, []);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNewsIndex((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [news]);

  const openMatchDetails = (match) => setSelectedMatch(match);
  const closeMatchDetails = () => setSelectedMatch(null);

  const getStatusClass = (match) => {
    if (match.status?.toLowerCase() === 'live') return 'live';
    if (String(match.scoreteam1) === '-' || String(match.scoreteam2) === '-' || String(match.status).toLowerCase() === 'tbd') return 'upcoming';
    if ((match.scoreteam1 && match.scoreteam2) && match.scoreteam1 !== '-' && match.scoreteam2 !== '-') return 'finished';
    return '';
  };

  return (
    <>
      <DynamicIsland theme="greek" />
      <div className="recup-scroll-wrapper-greek" onMouseMove={handleMouseMove}>
        <div className="parchment-texture-greek"></div>
        <div className="vignette-greek"></div>

        <div className="sidebar-left-greek">
          <div className="ancient-widget-greek ticker-widget-greek">
            <div className="widget-header-greek">
              <span className="header-text-greek">JADWAL LAGA</span>
            </div>
            <div className="ticker-container-greek">
              {matchSchedules.length > 0 ? (
                <div className="ticker-track-greek">
                  {[...matchSchedules, ...matchSchedules]
                    .filter(m => !checkIsBlacklisted(m))
                    .map((m, i) => (
                    <div key={`${m.team1}-${m.team2}-${i}`} className={`ticker-item-greek ${getStatusClass(m)}`} onClick={() => { setIsScheduleOpen(true); openMatchDetails(m); }}>
                      <div className="ti-time-greek">{m.time} - {m.competition}</div>
                      <div className="ti-match-greek">
                        <span className="ti-team">{m.team1}</span>
                        <span className="ti-vs">VS</span>
                        <span className="ti-team">{m.team2}</span>
                      </div>
                      <div className="ti-status-greek">
                        {m.status?.toLowerCase() === 'live' ? '🔥 LIVE' : 
                         (String(m.scoreteam1) === '-' || String(m.scoreteam2) === '-' || String(m.status).toLowerCase() === 'tbd') ? 'UPCOMING' : 
                          m.stage || m.category}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="loading-text-greek">Memanggil Penulis...</div>
              )}
            </div>
            <button className="read-more-btn-greek" onClick={() => setIsScheduleOpen(true)}>LIHAT SEMUA</button>
          </div>
        </div>

        <section className="center-stage-greek">
          <div className="clouds-container-greek">
            <img src="./assets/recup/cloud.webp" className="cloud-greek c1-greek" alt="" />
            <img src="./assets/recup/cloud.webp" className="cloud-greek c2-greek" alt="" />
          </div>

          <div className="title-area-greek">
            <img src="./assets/recup/title.webp" className="hero-title-greek" alt="RECUP Title" />
            <div className="hero-year-greek">EST. MMXXVI</div>
          </div>

          <div className="building-anchor-greek">
            <img src="./assets/recup/building.webp" className="hero-building-greek" alt="Pantheon" />
          </div>

          <div className="mobile-news-widget-greek">
            <div className="mn-inner-greek">
              <div className="mn-icon-greek"><GiScrollQuill /></div>
              <div className="mn-content-greek">
                <div key={activeNewsIndex} className="mn-text-animate">
                  <span className="mn-title-greek">{news[activeNewsIndex].title}:</span>
                  <span className="mn-desc-greek"> {news[activeNewsIndex].desc}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-buttons-container-greek">
            <a href="#merch" className="scroll-btn-greek">
              <span className="scroll-handle-left"></span>
              <span className="scroll-content">BELI MERCH</span>
              <span className="scroll-handle-right"></span>
            </a>
            <a href="#special-perf" className="scroll-btn-greek secondary-scroll-greek">
              <span className="scroll-handle-left"></span>
              <span className="scroll-content">GUEST STARS</span>
              <span className="scroll-handle-right"></span>
            </a>
          </div>
        </section>

        <div className="sidebar-right-greek">
          <div className="news-widget-greek">
            <div className="news-header-greek">
              <GiScrollQuill className="news-icon-greek" />
              <span>KABAR OLYMPUS</span>
            </div>
            <div className="news-content-area-greek">
              {news.map((item, index) => (
                <div key={index} className={`news-item-greek ${index === activeNewsIndex ? 'active' : ''}`}>
                  <h4 className="news-title-greek">{item.title}</h4>
                  <p className="news-desc-greek">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="news-indicators-greek">
              {news.map((_, i) => (
                <span key={i} className={`dot-greek ${i === activeNewsIndex ? 'active' : ''}`}></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button className="wax-fab-greek" onClick={() => setIsScheduleOpen(true)}>
        <div className="seal-inner-greek"><span className="seal-icon-greek"><GrSchedules /></span></div>
      </button>

      <div className={`parchment-modal-overlay-greek ${isScheduleOpen ? 'open-greek' : ''}`} onClick={() => setIsScheduleOpen(false)}>
        <RecupSchedule 
          groupedSchedules={groupedSchedules}
          activeTabDate={activeTabDate}
          activeTabComp={activeTabComp}
          setActiveTabDate={setActiveTabDate}
          setActiveTabComp={setActiveTabComp}
          onMatchClick={(match) => { openMatchDetails(match); setIsScheduleOpen(false); }}
          isBlacklistedFn={checkIsBlacklisted}
          onClose={() => setIsScheduleOpen(false)}
        />
      </div>

      {selectedMatch && (
        <div className="match-detail-overlay-greek" onClick={closeMatchDetails}>
          <div className="match-detail-scroll-greek" onClick={(e) => e.stopPropagation()}>
            <button className="md-close-btn-greek" onClick={closeMatchDetails}><IoMdClose /></button>
            <div className="md-content-wrapper">
              <div className="md-header-greek">
                <GiLaurels className="laurels-left" />
                <span className="md-title-text">DETAIL LAGA</span>
                <GiLaurels className="laurels-right" />
              </div>

              <div className="md-status-pill-greek">
                {selectedMatch.status === 'live' ? '🔥 SEDANG BERLANGSUNG' : 
                 (String(selectedMatch.scoreteam1) === '-' || String(selectedMatch.scoreteam2) === '-' || String(selectedMatch.status).toLowerCase() === 'tbd' ? 'AKAN DATANG' : 
                 (getStatusClass(selectedMatch) === 'finished' ? 'SELESAI' : 'TBD'))}
              </div>

              {selectedMatch.stage && <div className="md-stage-title-greek">{selectedMatch.stage}</div>}

              <div className="md-scoreboard-container">
                <div className="md-team-block">
                  <div className="md-team-info">
                    <div className={`md-team-logo-placeholder ${selectedMatch.winner === 'team1' || selectedMatch.winner === selectedMatch.team1.toLowerCase() ? 'winner-glow' : ''}`}>
                      {selectedMatch.team1.charAt(0)}
                    </div>
                    <div className="md-team-name">{selectedMatch.team1}</div>
                  </div>
                  {(selectedMatch.winner === 'team1' || selectedMatch.winner === selectedMatch.team1.toLowerCase()) && <span className="winner-label">WINNER</span>}
                </div>

                <div className="md-score-divider">
                  {(selectedMatch.scoreteam1 && selectedMatch.scoreteam2 && selectedMatch.scoreteam1 !== '-' && selectedMatch.scoreteam2 !== '-') ?
                    <div className="md-final-score">
                      <span className="score-big">{selectedMatch.scoreteam1}</span>
                      <span className="score-separator">-</span>
                      <span className="score-big">{selectedMatch.scoreteam2}</span>
                    </div> :
                    <span className="vs-text-big">VS</span>
                  }
                </div>

                <div className="md-team-block">
                  <div className="md-team-info">
                    <div className={`md-team-logo-placeholder ${selectedMatch.winner === 'team2' || selectedMatch.winner === selectedMatch.team2.toLowerCase() ? 'winner-glow' : ''}`}>
                      {selectedMatch.team2.charAt(0)}
                    </div>
                    <div className="md-team-name">{selectedMatch.team2}</div>
                  </div>
                  {(selectedMatch.winner === 'team2' || selectedMatch.winner === selectedMatch.team2.toLowerCase()) && <span className="winner-label">WINNER</span>}
                </div>
              </div>

              {selectedMatch.winner === 'draw' && <div className="md-draw-text">PERTANDINGAN SERI</div>}

              <div className="md-info-grid-greek">
                <div className="md-info-item"><span className="label">KOMPETISI</span><span className="value">{selectedMatch.competition}</span></div>
                <div className="md-info-item"><span className="label">KATEGORI</span><span className="value">{selectedMatch.category}</span></div>
                <div className="md-info-item"><span className="label">TANGGAL</span><span className="value">{selectedMatch.date}</span></div>
                <div className="md-info-item"><span className="label">PUKUL</span><span className="value">{selectedMatch.time} WIB</span></div>
              </div>

              <div className="md-footer-greek">Semoga tim terbaik yang menang.</div>
            </div>
          </div>
        </div>
      )}

      <RecupSpecialPerformance />
      <RecupGuestStar />
      <RecupCompetitions />
      <RecupMerch />
      <RecupFooter />
    </>
  );
}

export default Recup;