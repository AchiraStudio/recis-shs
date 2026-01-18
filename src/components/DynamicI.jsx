import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { FaInstagram, FaSearch, FaGlobe, FaRedo, FaMoon, FaSun } from "react-icons/fa"; 
import { GiLaurels, GiGreekTemple } from "react-icons/gi";
import * as XLSX from 'xlsx';
import './DynamicIsland.css';

const DynamicIsland = forwardRef(({ onInstagramClick, theme = '', onToggle, zIndexOverride, onThemeToggle, isDarkMode }, ref) => {
  const [isActive, setIsActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  
  const isRecupPage = window.location.pathname.toLowerCase().includes('ascension');
  const islandRef = useRef(null);
  const searchInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    collapse: () => collapseIsland(),
    activate: () => setIsActive(true)
  }));

  useEffect(() => {
    if (onToggle) onToggle(isActive);
  }, [isActive, onToggle]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('data/events/events.xlsx');
        if (!response.ok) throw new Error("File not found");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setPages(json);
        setFilteredPages(json);
      } catch (error) {
        setPages([]);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleClickOutside = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target)) {
        if (showSearch) {
          setShowSearch(false);
          setIsActive(false);
        } else if (isActive) {
          collapseIsland();
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, showSearch]);

  const toggleIsland = () => {
    if (showSearch) return;
    if (isActive) collapseIsland();
    else setIsActive(true);
  };

  const collapseIsland = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsActive(false);
      setIsExiting(false);
    }, 300); 
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    if (action === 'search') {
      setShowSearch(true);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else if (action === 'instagram') {
      onInstagramClick?.() || window.open('https://www.instagram.com/recisshs/#', '_blank');
    } else if (action === 'home') {
      window.location.href = '/';
    } else if (action === 'theme') {
      if (onThemeToggle) onThemeToggle();
    }
  };

  const handleResetTutorial = () => {
    if (window.confirm("Ulangi Tutorial? Halaman akan direfresh.")) {
      localStorage.removeItem('hasSeenAscensionTutorial');
      window.location.reload();
    }
  };

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const results = searchQuery 
      ? pages.filter(p => (p.name || '').toLowerCase().includes(lowerQuery))
      : pages;
    setFilteredPages(results);
  }, [searchQuery, pages]);

  // --- CLASS LOGIC ---
  // 1. If Recup: Add 'greek-theme'
  // 2. If Recup AND Light Mode: Add 'light-mode'
  const wrapperClass = `di-wrapper ${isScrolled ? 'scrolled' : ''} ${theme} ${isRecupPage ? 'greek-theme' : ''} ${!isDarkMode && isRecupPage ? 'light-mode' : ''}`;

  return (
    <div 
      className={wrapperClass}
      ref={islandRef}
      style={{ zIndex: zIndexOverride ? 10005 : 9999 }} 
    >
      <div 
        className={`di-pill ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''} ${showSearch ? 'search-mode' : ''}`}
        onClick={toggleIsland}
      >
        <div className="di-content">
          <div className="di-idle">
            <div className="di-status-icon">
              {isRecupPage ? <GiLaurels /> : <div className="di-signal"></div>}
            </div>
            <span className="di-label">RSHS</span>
          </div>

          <div className="di-menu">
            <button onClick={(e) => handleAction(e, 'home')} aria-label="Home">
              {isRecupPage ? <GiGreekTemple /> : <FaGlobe />}
            </button>
            
            {onThemeToggle && (
               <>
                 <div className="di-divider"></div>
                 <button onClick={(e) => handleAction(e, 'theme')} aria-label="Theme">
                    {isDarkMode ? <FaSun /> : <FaMoon />}
                 </button>
               </>
            )}

            <div className="di-divider"></div>
            <button onClick={(e) => handleAction(e, 'search')} aria-label="Search">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
      
      <div className={`di-search-panel ${showSearch ? 'open' : ''}`}>
        <div className="di-search-input-wrap">
           <input 
            ref={searchInputRef}
            type="text" 
            placeholder={isRecupPage ? "Search Oracle..." : "Search events..."} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()} 
          />
        </div>

        <div className="di-results">
          {filteredPages.map((page, i) => (
            <a key={i} href={page.link || '#'} className="di-result-row">
              <div className="res-left">
                <span className="res-name">{page.name}</span>
                <span className="res-cat">{page.category}</span>
              </div>
              {page.date && <span className="res-date">{page.date}</span>}
            </a>
          ))}

          {(!searchQuery || 'tutorial'.includes(searchQuery.toLowerCase())) && (
            <div className="di-result-row tutorial-reset-row" onClick={handleResetTutorial}>
              <div className="res-left">
                <span className="res-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaRedo size={12}/> Reset Tutorial
                </span>
                <span className="res-cat">System</span>
              </div>
              <span className="res-date">Action</span>
            </div>
          )}

          {filteredPages.length === 0 && searchQuery && !'tutorial'.includes(searchQuery.toLowerCase()) && (
            <div className="di-no-res">No matches found.</div>
          )}
        </div>
      </div>
    </div>
  );
});

export default DynamicIsland;