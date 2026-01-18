import React, { useState, useEffect } from "react";
import DynamicIsland from "../../components/DynamicI";
import "./css/recup-scroll.css";

import { IoMdClose, IoMdTrophy } from "react-icons/io";
import { GiLaurels, GiGreekTemple } from "react-icons/gi";
import { FiArrowRight } from "react-icons/fi";

import RecupGuestStar from "./recup-jiband";
import RecupCompetitions from "./recup-list-lomba";
import RecupMerch from "./recup-merch";
import RecupFooter from "./recup-footer";
import RecupSpecialPerformance from "./recup-tulus";

const SCHEDULE_API =
  "https://script.google.com/macros/s/AKfycbxcR39xEqBTH8Rq8lAE2hLvZXKzwWOdG8LK0qqWm7m7kjyYlrm2QAHx2L2XxE-TRJQ3/exec";

// ✅ Put your PNG in: /public/icons/recup-icon.png
const RECUP_FAVICON_PATH = "/ascension.png";

// ✅ Page title only for this page
const RECUP_PAGE_TITLE = "Ascension Cup — Official Website";

const formatDate = (dateStr) => {
  try {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }), // MON
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), // OCT 24
    };
  } catch (e) {
    return { day: "", date: dateStr };
  }
};

// --- favicon helpers (page-specific) ---
const ensureFaviconLink = () => {
  let link =
    document.querySelector("link[rel='icon']") ||
    document.querySelector("link[rel='shortcut icon']");

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.type = "image/png";
  return link;
};

const setFavicon = (href, cacheBust = true) => {
  const link = ensureFaviconLink();
  if (!href) return;

  const finalHref = cacheBust
    ? href.includes("?")
      ? `${href}&v=${Date.now()}`
      : `${href}?v=${Date.now()}`
    : href;

  link.href = finalHref;
};

const getCurrentFaviconHref = () => {
  const link =
    document.querySelector("link[rel='icon']") ||
    document.querySelector("link[rel='shortcut icon']");
  return link?.getAttribute("href") || null;
};

// --- title helpers (page-specific) ---
const getCurrentTitle = () => document.title;
const setTitle = (title) => {
  if (typeof title === "string") document.title = title;
};

const OracleCard = ({ match }) => {
  const isLive = match.status?.toLowerCase() === "live";
  const isUpcoming = match.scoreteam1 === "-" || match.scoreteam2 === "-";
  const w = match.winner ? match.winner.toLowerCase() : "";
  const t1Win = w === "team1" || w === match.team1?.toLowerCase();
  const t2Win = w === "team2" || w === match.team2?.toLowerCase();

  return (
    <div className="oracle-card">
      <div className="oc-time">
        <div>
          <span className="time-val">{match.time}</span>
          <span className="time-wib">WIB</span>
        </div>
      </div>

      <div className="oc-status">
        {isLive ? (
          <span className="status-badge live">LIVE</span>
        ) : isUpcoming ? (
          <span className="status-badge upcoming">VS</span>
        ) : (
          <span className="status-badge finished">FT</span>
        )}
      </div>

      <div className="oc-info">
        <span className="info-comp">
          {match.competition} • {match.category || "Group Stage"}
        </span>
        <div className="info-teams">
          <div className={`team-row ${t1Win ? "winner" : ""}`}>
            <span>{match.team1}</span>
            <span>{isUpcoming ? "" : match.scoreteam1}</span>
          </div>
          <div className={`team-row ${t2Win ? "winner" : ""}`}>
            <span>{match.team2}</span>
            <span>{isUpcoming ? "" : match.scoreteam2}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function Recup() {
  const [matches, setMatches] = useState([]);
  const [groupedMatches, setGroupedMatches] = useState({});
  const [news, setNews] = useState([]);
  const [activeNewsIdx, setActiveNewsIdx] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDate, setActiveDate] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  // ✅ Recup page-specific favicon + title: set on mount, restore on unmount
  useEffect(() => {
    const prevFaviconHref = getCurrentFaviconHref();
    const prevTitle = getCurrentTitle();

    setFavicon(RECUP_FAVICON_PATH, true);
    setTitle(RECUP_PAGE_TITLE);

    return () => {
      // restore favicon
      if (prevFaviconHref) setFavicon(prevFaviconHref, false);

      // restore title
      if (prevTitle) setTitle(prevTitle);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(SCHEDULE_API);
        const data = await res.json();
        if (Array.isArray(data)) {
          const valid = data
            .filter((m) => m.team1 && m.team2)
            .sort(
              (a, b) =>
                new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
            );

          setMatches(valid);

          const groups = {};
          valid.forEach((m) => {
            if (!groups[m.date]) groups[m.date] = [];
            groups[m.date].push(m);
          });
          setGroupedMatches(groups);

          if (!activeDate && Object.keys(groups).length > 0) {
            setActiveDate(Object.keys(groups)[0]);
          }

          const live = valid.filter((m) => m.status?.toLowerCase() === "live");
          setNews((prev) => [
            ...live.map((m) => ({ title: "LIVE", desc: `${m.team1} vs ${m.team2}` })),
            ...prev,
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []); // eslint-disable-line

  const handleMouseMove = (e) => {
    if (window.innerWidth <= 1024) return;
    const title = document.querySelector(".hero-title");
    const bldg = document.querySelector(".hero-building-img");
    if (title) {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      title.style.transform = `translate(${x}px, ${y}px)`;
      if (bldg) bldg.style.transform = `translate(${x * 0.5}px, ${y * 0.2 + 10}%)`;
    }
  };

  const displayMatches = (() => {
    if (!activeDate || !groupedMatches[activeDate]) return [];
    const ms = groupedMatches[activeDate];
    if (activeFilter === "ALL") return ms;
    return ms.filter((m) => m.competition === activeFilter);
  })();

  const availableFilters =
    activeDate && groupedMatches[activeDate]
      ? ["ALL", ...new Set(groupedMatches[activeDate].map((m) => m.competition))]
      : ["ALL"];

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      <DynamicIsland
        theme={isDarkMode ? "dark" : "light"}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        isDarkMode={isDarkMode}
      />

      <div className="olympus-container" onMouseMove={handleMouseMove}>
        <div className="noise-overlay"></div>
        <div className="cloud-layer">
          <img src="./assets/recup/cloud.webp" className="hero-cloud-img c1" alt="" />
          <img src="./assets/recup/cloud.webp" className="hero-cloud-img c2" alt="" />
        </div>
        <div className="ancient-layer">
          <img
            src="./assets/recup/building.webp"
            className="hero-building-img"
            alt="Pantheon"
          />
        </div>

        <div className="hero-wrapper">
          <span className="est-tag">EST. MMXXVI</span>
          <h1 className="hero-title">
            ASCENSION
            <br />
            CUP
          </h1>
          <span className="hero-subtitle">VIVA RECIS!</span>
          <div className="hero-buttons">
            <button className="btn-greek" onClick={() => setIsModalOpen(true)}>
              <GiGreekTemple size={20} /> SCHEDULE
            </button>
            <a href="#merch" className="btn-greek" style={{ borderStyle: "dashed" }}>
              MERCH <FiArrowRight />
            </a>
          </div>
        </div>

        <div className="ticker-bar">
          <div className="ticker-label">
            <GiLaurels size={20} style={{ marginRight: 8 }} /> TICKER
          </div>
          <div className="ticker-content">
            {[...matches, ...matches].slice(0, 30).map((m, i) => (
              <div key={i} className="ticker-item" onClick={() => setIsModalOpen(true)}>
                {m.status?.toLowerCase() === "live" && <span className="live-dot"></span>}
                <span style={{ color: "var(--gold-primary)" }}>{m.time}</span>
                <span style={{ marginLeft: 5 }}>
                  {m.team1} vs {m.team2}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- ORACLE MODAL (ANDROID OPTIMIZED) --- */}
      <div
        className={`modal-overlay ${isModalOpen ? "open" : ""}`}
        onClick={() => setIsModalOpen(false)}
      >
        <div className="oracle-modal" onClick={(e) => e.stopPropagation()}>
          {/* Top Bar / Sidebar */}
          <div className="oracle-sidebar">
            <div className="os-header">
              <GiGreekTemple /> DATES
            </div>
            <div className="os-dates">
              {Object.keys(groupedMatches).map((date) => {
                const { day, date: dStr } = formatDate(date);
                const count = groupedMatches[date].length;
                return (
                  <button
                    key={date}
                    className={`os-date-btn ${activeDate === date ? "active" : ""}`}
                    onClick={() => {
                      setActiveDate(date);
                      setActiveFilter("ALL");
                    }}
                  >
                    <span className="os-day">{day}</span>
                    <span className="os-num">{dStr}</span>
                    <span className="os-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="oracle-content">
            <div className="oc-header">
              <div className="oc-filters">
                {availableFilters.map((f) => (
                  <button
                    key={f}
                    className={`oc-filter ${activeFilter === f ? "active" : ""}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button className="oc-close" onClick={() => setIsModalOpen(false)}>
                <IoMdClose />
              </button>
            </div>

            <div className="oc-feed">
              {displayMatches.length > 0 ? (
                displayMatches.map((m, i) => <OracleCard key={i} match={m} />)
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                    minHeight: "300px",
                  }}
                >
                  <IoMdTrophy size={40} style={{ marginBottom: 15, opacity: 0.5 }} />
                  No matches.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 5,
          background: "var(--bg-main)",
          color: "var(--text-main)",
          transition: "all 0.5s",
        }}
      >
        <RecupSpecialPerformance />
        <RecupGuestStar />
        <RecupCompetitions />
        <RecupMerch />
        <RecupFooter />
      </div>
    </div>
  );
}

export default Recup;
