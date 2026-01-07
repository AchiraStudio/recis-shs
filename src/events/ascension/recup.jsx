import { useState, useEffect, useRef } from "react";
import DynamicIsland from "../../components/DynamicI";
import "./css/recup-scroll.css"; 
import "./css/recup-column.css";

// Icons
import { GrSchedules } from "react-icons/gr";
import { IoMdClose } from "react-icons/io"; 
import { GiScrollQuill, GiLaurels } from "react-icons/gi";

// Sections
import RecupGuestStar from "./recup-jiband";
import RecupCompetitions from "./recup-list-lomba";
import RecupMerch from "./recup-merch";
import RecupFooter from "./recup-footer";
import RecupSpecialPerformance from "./recup-tulus";

const SCHEDULE_API = "https://script.google.com/macros/s/AKfycbxcR39xEqBTH8Rq8lAE2hLvZXKzwWOdG8LK0qqWm7m7kjyYlrm2QAHx2L2XxE-TRJQ3/exec";

// --- TEMPLATES BERITA ---
const NEWS_TEMPLATES = {
  withScore: [
    (w, l, s) => `${w} melibas ${l} dengan skor telak ${s}!`,
    (w, l, s) => `Dominasi total! ${w} membungkam ${l} (${s}).`,
    (w, l, s) => `Pertandingan sengit berakhir: ${w} ${s} - ${l}.`,
    (w, l, s) => `Papan skor berbicara: ${w} menang ${s} atas ${l}.`,
    (w, l, s) => `Tak terbendung! ${w} mengunci kemenangan ${s}.`,
    (w, l, s) => `Sejarah tercipta: ${w} mengungguli ${l} (${s}).`,
    (w, l, s) => `Gemuruh penonton menyambut kemenangan ${w} (${s})!`,
    (w, l, s) => `${w} tampil memukau kontra ${l}, skor akhir ${s}.`,
    (w, l, s) => `Peluit panjang berbunyi. ${w} ${s}, ${l} tumbang.`,
    (w, l, s) => `Kemenangan manis ${s} diraih oleh ${w}.`
  ],
  noScore: [
    (w, l) => `${w} berhasil mengamankan kemenangan atas ${l}!`,
    (w, l) => `Kemenangan krusial bagi ${w} dalam laga kontra ${l}.`,
    (w, l) => `${l} gagal membendung serangan bertubi-tubi dari ${w}.`,
    (w, l) => `Kejayaan milik ${w} hari ini setelah mengalahkan ${l}.`,
    (w, l) => `${w} melaju mulus setelah menundukkan ${l}.`,
    (w, l) => `Dewi Fortuna berpihak pada ${w} saat melawan ${l}.`,
    (w, l) => `Satu lagi kemenangan dikantongi oleh ${w}!`,
    (w, l) => `${w} berdiri tegak sebagai pemenang melawan ${l}.`,
    (w, l) => `Mahkota kemenangan jatuh kepada ${w}.`,
    (w, l) => `Sorak sorai untuk ${w} yang berhasil menang!`
  ],
  lossPerspective: [
    (w, l, s) => `${l} harus mengakui keunggulan ${w}${s ? ` (${s})` : ''}.`,
    (w, l, s) => `Nasib kurang beruntung bagi ${l}, takluk di tangan ${w}.`,
    (w, l, s) => `${l} dipaksa menyerah oleh permainan apik ${w}.`,
    (w, l, s) => `Perjuangan keras ${l} belum cukup untuk menahan ${w}.`,
    (w, l, s) => `${l} pulang dengan tangan hampa setelah ditekuk ${w}.`,
    (w, l, s) => `Pertahanan ${l} runtuh di hadapan ${w}.`,
    (w, l, s) => `${l} gagal mencuri poin dari ${w} hari ini.`,
    (w, l, s) => `Hari yang berat bagi ${l} setelah dikalahkan ${w}.`
  ],
  draw: [
    (t1, t2, s) => `Sama kuat! ${t1} dan ${t2} berbagi angka ${s ? `(${s})` : ''}.`,
    (t1, t2, s) => `Pertarungan sengit antara ${t1} vs ${t2} berakhir imbang.`,
    (t1, t2, s) => `Tidak ada pemenang! Skor kacamata untuk ${t1} dan ${t2}.`,
    (t1, t2, s) => `Damai di Colosseum? ${t1} dan ${t2} main seri.`,
    (t1, t2, s) => `Jual beli serangan, namun ${t1} vs ${t2} berakhir sama kuat.`,
    (t1, t2, s) => `Hasil imbang yang adil bagi ${t1} dan ${t2}.`,
    (t1, t2, s) => `Skor imbang menutup laga panas ${t1} kontra ${t2}.`,
    (t1, t2, s) => `Kedua tim bermain hati-hati. ${t1} seri lawan ${t2}.`,
    (t1, t2, s) => `Berbagi poin! ${t1} ${s ? s : '-'} ${t2}.`,
    (t1, t2, s) => `Kebuntuan tak terpecahkan antara ${t1} dan ${t2}.`
  ],
  upcoming: [
    (t1, t2) => `Nantikan laga panas antara ${t1} melawan ${t2}!`,
    (t1, t2) => `Siapakah yang akan berjaya? ${t1} atau ${t2}?`,
    (t1, t2) => `Jangan lewatkan! ${t1} akan berhadapan dengan ${t2}.`,
    (t1, t2) => `Perseteruan di arena: ${t1} vs ${t2} segera hadir.`,
    (t1, t2) => `Dukung tim jagoanmu! ${t1} kontra ${t2} menanti.`,
    (t1, t2) => `Big Match! ${t1} bertemu ${t2} di jadwal berikutnya.`,
    (t1, t2) => `Persiapan matang ${t1} akan diuji oleh ${t2}.`,
    (t1, t2) => `Atmosfer memanas jelang laga ${t1} vs ${t2}.`,
    (t1, t2) => `Saksikan aksi ${t1} menantang ${t2} di arena.`,
    (t1, t2) => `Prediksi skor Anda untuk ${t1} vs ${t2}?`
  ],
  staticTeasers: [
    { title: "Segera Dimulai", desc: "Upacara Pembukaan menanti pada 24 Januari." },
    { title: "Para Pejuang Siap", desc: "Tim-tim sedang mematangkan strategi mereka." },
    { title: "Ascension Cup", desc: "Siapa yang akan naik ke Olympus tahun ini?" },
    { title: "Catat Tanggalnya", desc: "24 Jan: Hari di mana bumi bergoncang." },
    { title: "Bersiaplah", desc: "Siapkan yel-yel kalian. Pertandingan makin dekat." }
  ]
};

function Recup() {
  const [matchSchedules, setMatchSchedules] = useState([]);
  const [news, setNews] = useState(NEWS_TEMPLATES.staticTeasers); 
  
  // UI States
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);

  // --- TABS STATE ---
  const [groupedSchedules, setGroupedSchedules] = useState({});
  const [activeTabDate, setActiveTabDate] = useState('');

  // --- 1. SETUP AWAL ---
  useEffect(() => {
    document.title = "Ascension Cup - Official Website";
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) favicon.href = "/assets/recup/favicon-recucp.png";
  }, []);

  // --- 2. LOGIC GENERATOR BERITA ---
  const generateNewsFromData = (data) => {
    let finalNews = [];
    const parseDate = (d, t) => new Date(`${d} ${t}`);

    const completedMatches = data.filter(m => {
      const winner = m.winner ? m.winner.toLowerCase().trim() : '';
      const score = m.score ? m.score.toString().trim() : '';
      return (winner !== '' && winner !== 'tbd') || (score !== '' && score !== '-');
    });

    const upcomingMatches = data.filter(m => {
      const winner = m.winner ? m.winner.toLowerCase().trim() : '';
      const score = m.score ? m.score.toString().trim() : '';
      return (winner === '' || winner === 'tbd') && (score === '' || score === '-');
    });

    const recentCompleted = completedMatches
      .sort((a, b) => parseDate(b.date, b.time) - parseDate(a.date, a.time))
      .slice(0, 5);

    const resultNews = recentCompleted.map(match => {
      const rawWinner = match.winner ? match.winner.toLowerCase().trim() : '';
      const score = match.score;
      const t1 = match.team1;
      const t2 = match.team2;
      let newsItem = {};

      if (rawWinner === 'draw') {
        const idx = Math.floor(Math.random() * NEWS_TEMPLATES.draw.length);
        newsItem = { title: "Hasil Imbang", desc: NEWS_TEMPLATES.draw[idx](t1, t2, score) };
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
        if (variantType === 0 && score && score !== "-" && score !== "") {
          const idx = Math.floor(Math.random() * NEWS_TEMPLATES.withScore.length);
          newsItem = { title: "Laporan Laga", desc: NEWS_TEMPLATES.withScore[idx](winnerName, loserName, score) };
        } else if (variantType === 1) {
          const idx = Math.floor(Math.random() * NEWS_TEMPLATES.lossPerspective.length);
          newsItem = { title: "Pasca Laga", desc: NEWS_TEMPLATES.lossPerspective[idx](winnerName, loserName, score) };
        } else {
          const idx = Math.floor(Math.random() * NEWS_TEMPLATES.noScore.length);
          newsItem = { title: "Kabar Kemenangan", desc: NEWS_TEMPLATES.noScore[idx](winnerName, loserName) };
        }
      }
      return newsItem;
    });
    
    finalNews = [...finalNews, ...resultNews];

    const nearestUpcoming = upcomingMatches
      .sort((a, b) => parseDate(a.date, a.time) - parseDate(b.date, b.time));

    if (finalNews.length < 6 && nearestUpcoming.length > 0) {
      const slotsNeeded = 6 - finalNews.length;
      const teasers = nearestUpcoming.slice(0, slotsNeeded).map(match => {
        const idx = Math.floor(Math.random() * NEWS_TEMPLATES.upcoming.length);
        return {
          title: "Segera Hadir",
          desc: NEWS_TEMPLATES.upcoming[idx](match.team1, match.team2)
        };
      });
      finalNews = [...finalNews, ...teasers];
    }

    if (finalNews.length === 0) {
      setNews(NEWS_TEMPLATES.staticTeasers);
    } else {
      setNews(finalNews);
    }
  };

  // --- 3. FETCH DATA & SORTING (UPDATED FOR LIVE PRIORITY) ---
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(SCHEDULE_API);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const parseDate = (d, t) => new Date(`${d} ${t}`);
          const sortedData = data.sort((a, b) => parseDate(a.date, a.time) - parseDate(b.date, a.time)); // Global sort
          
          setMatchSchedules(sortedData);
          generateNewsFromData(sortedData); 

          // --- GROUPING LOGIC ---
          const groups = {};
          sortedData.forEach(match => {
            if (!groups[match.date]) {
              groups[match.date] = [];
            }
            groups[match.date].push(match);
          });

          // --- SORTING WITHIN GROUPS: LIVE FIRST ---
          Object.keys(groups).forEach(date => {
            groups[date].sort((a, b) => {
              const aLive = a.status?.toLowerCase() === 'live';
              const bLive = b.status?.toLowerCase() === 'live';

              // Priority: Live > Finished > Upcoming
              if (aLive && !bLive) return -1;
              if (!aLive && bLive) return 1;

              // Secondary sort: Time
              return a.time.localeCompare(b.time);
            });
          });

          setGroupedSchedules(groups);

          const dates = Object.keys(groups);
          if (dates.length > 0 && !activeTabDate) {
            setActiveTabDate(dates[0]);
          }

        }
      } catch (err) { console.error("API Error", err); }
    };
    
    fetchSchedule();
    const interval = setInterval(fetchSchedule, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- 4. ANIMASI ---
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
    if ((match.winner && match.winner !== 'tbd') || match.score) return 'finished';
    return '';
  };

  // Helper to parse scores for display
  const parseScores = (scoreStr) => {
    if(!scoreStr) return { t1: '-', t2: '-' };
    // Assuming format "X-Y" or similar
    const parts = scoreStr.split('-');
    return {
      t1: parts[0] || '',
      t2: parts[1] || ''
    };
  };

  return (
    <>
      <DynamicIsland theme="greek" />

      {/* === HERO WRAPPER === */}
      <div className="recup-scroll-wrapper-greek" onMouseMove={handleMouseMove}>
        <div className="parchment-texture-greek"></div>
        <div className="vignette-greek"></div>

        {/* --- LEFT: TICKER DESKTOP --- */}
        <div className="sidebar-left-greek">
          <div className="ancient-widget-greek ticker-widget-greek">
            <div className="widget-header-greek">
              <span className="header-text-greek">JADWAL LAGA</span>
            </div>
            <div className="ticker-container-greek">
              {matchSchedules.length > 0 ? (
                <div className="ticker-track-greek">
                  {[...matchSchedules, ...matchSchedules].map((m, i) => (
                    <div key={i} className={`ticker-item-greek ${getStatusClass(m)}`} onClick={() => { setIsScheduleOpen(true); openMatchDetails(m); }}>
                      <div className="ti-time-greek">{m.time}</div>
                      <div className="ti-match-greek">
                        <span className="ti-team">{m.team1}</span>
                        <span className="ti-vs">VS</span>
                        <span className="ti-team">{m.team2}</span>
                      </div>
                      <div className="ti-status-greek">
                        {m.status?.toLowerCase() === 'live' ? '🔥 LIVE' : m.category}
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

        {/* --- CENTER STAGE --- */}
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

          {/* === MOBILE NEWS WIDGET === */}
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

        {/* --- RIGHT: NEWS DESKTOP --- */}
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

      {/* === MOBILE FAB === */}
      <button className="wax-fab-greek" onClick={() => setIsScheduleOpen(true)}>
        <div className="seal-inner-greek"><span className="seal-icon-greek"><GrSchedules /></span></div>
      </button>

      {/* === MODAL LIST JADWAL (FULL SCREEN + LIVE PRIORITY + SCORES) === */}
      <div className={`parchment-modal-overlay-greek ${isScheduleOpen ? 'open-greek' : ''}`} onClick={() => setIsScheduleOpen(false)}>
        <div className="parchment-modal-greek" onClick={e => e.stopPropagation()}>
          <div className="pm-header-greek">
            <h2>TITAH RESMI</h2>
            <button className="pm-close-greek" onClick={() => setIsScheduleOpen(false)}><IoMdClose /></button>
          </div>
          
          {/* --- TABS --- */}
          <div className="pm-tabs-container-greek">
            {Object.keys(groupedSchedules).map((date, idx) => (
              <button 
                key={idx} 
                className={`pm-tab-greek ${activeTabDate === date ? 'active' : ''}`}
                onClick={() => setActiveTabDate(date)}
              >
                {date}
              </button>
            ))}
          </div>

          {/* --- INFINITE AUTO SCROLL BODY --- */}
          <div className="pm-body-greek">
            {groupedSchedules[activeTabDate] && groupedSchedules[activeTabDate].length > 0 ? (
              <div className="pm-infinite-scroll-wrapper-greek">
                <div className="pm-infinite-track-greek">
                  {[...groupedSchedules[activeTabDate], ...groupedSchedules[activeTabDate]].map((match, idx) => {
                    const scores = parseScores(match.score);
                    return (
                      <div key={idx} className={`decree-card-greek ${getStatusClass(match)}`} onClick={() => openMatchDetails(match)}>
                        {/* LEFT SIDE: INFO + SCORE T1 */}
                        <div className="dc-left-greek">
                          <div className="dc-top-info-greek">
                            <span className="dc-time-greek">{match.time}</span>
                            <span className="dc-cat-greek">{match.category}</span>
                          </div>
                          {(match.status?.toLowerCase() === 'live' || match.score) && (
                            <span className={`dc-score-greek ${match.winner === 'team1' ? 'winner' : ''}`}>
                              {scores.t1}
                            </span>
                          )}
                        </div>

                        {/* CENTER: TEAMS */}
                        <div className="dc-center-greek">
                          <div className="dc-team-greek">{match.team1}</div>
                          <div className="dc-vs-greek">VS</div>
                          <div className="dc-team-greek">{match.team2}</div>
                        </div>

                        {/* RIGHT SIDE: STATUS + SCORE T2 */}
                        <div className="dc-right-greek">
                          <div className="dc-top-info-greek">
                            {match.status?.toLowerCase() === 'live' ? 
                              <span className="live-tag-greek">LIVE</span> : 
                              <span className="date-tag-greek">{match.date}</span>
                            }
                          </div>
                          {(match.status?.toLowerCase() === 'live' || match.score) && (
                            <span className={`dc-score-greek ${match.winner === 'team2' ? 'winner' : ''}`}>
                              {scores.t2}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="loading-text-greek" style={{textAlign: 'center', marginTop: '20px'}}>
                Tidak ada pertandingan pada tanggal ini.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* === POPUP DETAIL MATCH === */}
      {selectedMatch && (
        <div className="match-detail-overlay-greek" onClick={closeMatchDetails}>
          <div className="match-detail-scroll-greek" onClick={(e) => e.stopPropagation()}>
            <button className="md-close-btn-greek" onClick={closeMatchDetails}><IoMdClose /></button>
            <div className="md-header-greek">
              <GiLaurels className="laurels-left" /><span>DETAIL LAGA</span><GiLaurels className="laurels-right" />
            </div>
            <div className="md-status-pill-greek">
              {selectedMatch.status === 'live' ? '🔥 SEDANG BERLANGSUNG' : (getStatusClass(selectedMatch) === 'finished' ? 'SELESAI' : 'AKAN DATANG')}
            </div>
            <div className="md-versus-section-greek">
              {/* TEAM 1 */}
              <div className="md-team-block">
                <div className={`md-team-logo-placeholder ${selectedMatch.winner === 'team1' || selectedMatch.winner === selectedMatch.team1.toLowerCase() ? 'winner-glow' : ''}`}>
                  {selectedMatch.team1.charAt(0)}
                </div>
                <div className="md-team-name">{selectedMatch.team1}</div>
                {(selectedMatch.winner === 'team1' || selectedMatch.winner === selectedMatch.team1.toLowerCase()) && <span className="winner-label">MENANG</span>}
              </div>
              {/* SCORE / VS */}
              <div className="md-vs-divider">
                {selectedMatch.score ? <span className="score-big">{selectedMatch.score}</span> : <span>VS</span>}
              </div>
              {/* TEAM 2 */}
              <div className="md-team-block">
                <div className={`md-team-logo-placeholder ${selectedMatch.winner === 'team2' || selectedMatch.winner === selectedMatch.team2.toLowerCase() ? 'winner-glow' : ''}`}>
                  {selectedMatch.team2.charAt(0)}
                </div>
                <div className="md-team-name">{selectedMatch.team2}</div>
                {(selectedMatch.winner === 'team2' || selectedMatch.winner === selectedMatch.team2.toLowerCase()) && <span className="winner-label">MENANG</span>}
              </div>
            </div>
            {selectedMatch.winner === 'draw' && <div className="md-draw-text">PERTANDINGAN SERI</div>}
            <div className="md-info-grid-greek">
              <div className="md-info-item"><span className="label">KATEGORI</span><span className="value">{selectedMatch.category}</span></div>
              <div className="md-info-item"><span className="label">TANGGAL</span><span className="value">{selectedMatch.date}</span></div>
              <div className="md-info-item"><span className="label">PUKUL</span><span className="value">{selectedMatch.time} WIB</span></div>
              <div className="md-info-item"><span className="label">LOKASI</span><span className="value">Arena Utama</span></div>
            </div>
            <div className="md-footer-greek">Semoga tim terbaik yang menang.</div>
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