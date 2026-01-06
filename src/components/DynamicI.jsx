import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { FaInstagram, FaSearch, FaGlobe, FaRedo } from "react-icons/fa"; // Added FaRedo for tutorial icon
import * as XLSX from 'xlsx';
import './DynamicIsland.css';
import './DynamicIsland-greek.css';

const DynamicIsland = forwardRef(({ onInstagramClick, theme = '', onToggle, zIndexOverride }, ref) => {
  const [isActive, setIsActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  // Search States
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  
  const islandRef = useRef(null);
  const searchInputRef = useRef(null);

  // --- KOMUNIKASI DENGAN PARENT (TUTORIAL) ---
  useImperativeHandle(ref, () => ({
    collapse: () => collapseIsland(),
    activate: () => setIsActive(true)
  }));

  // Notify parent when state changes
  useEffect(() => {
    if (onToggle) onToggle(isActive);
  }, [isActive, onToggle]);

  // 1. Load Excel Data
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
        // Fallback data
        setPages([
          { name: 'Science Fair', category: 'Academic', date: 'Oct 15', link: '#' },
          { name: 'Basket Final', category: 'Sports', date: 'Nov 02', link: '#' },
          { name: 'Art Show', category: 'Arts', date: 'Dec 10', link: '#' },
        ]);
      }
    };
    loadData();
  }, []);

  // 2. Scroll & Click Outside
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

  // --- Actions ---
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
    }
  };

  // --- FUNGSI RESET TUTORIAL ---
  const handleResetTutorial = () => {
    if (window.confirm("Ulangi Tutorial? Halaman akan direfresh.")) {
      localStorage.removeItem('hasSeenAscensionTutorial');
      window.location.reload();
    }
  };

  // Search Logic
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const results = searchQuery 
      ? pages.filter(p => (p.name || '').toLowerCase().includes(lowerQuery))
      : pages;
    setFilteredPages(results);
  }, [searchQuery, pages]);

  return (
    <div 
      className={`di-wrapper ${isScrolled ? 'scrolled' : ''} ${theme}`} 
      ref={islandRef}
      style={{ zIndex: zIndexOverride ? 10005 : 9999 }} 
    >
      <div 
        className={`di-pill ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''} ${showSearch ? 'search-mode' : ''}`}
        onClick={toggleIsland}
      >
        <div className="di-content">
          <div className="di-idle">
            <div className="di-signal"></div>
            <span className="di-label">RSHS</span>
          </div>
          <div className="di-menu">
            <button onClick={(e) => handleAction(e, 'instagram')} aria-label="IG"><FaInstagram /></button>
            <div className="di-divider"></div>
            <button onClick={(e) => handleAction(e, 'home')} aria-label="Home"><FaGlobe /></button>
            <div className="di-divider"></div>
            <button onClick={(e) => handleAction(e, 'search')} aria-label="Search"><FaSearch /></button>
          </div>
        </div>
      </div>
      
      {/* --- SEARCH PANEL YANG SUDAH DIPERBAIKI --- */}
      <div className={`di-search-panel ${showSearch ? 'open' : ''}`}>
        <div className="di-search-input-wrap">
           <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()} // Agar tidak menutup saat diklik
          />
        </div>

        <div className="di-results">
          {/* 1. Hasil Pencarian Normal */}
          {filteredPages.map((page, i) => (
            <a key={i} href={page.link || '#'} className="di-result-row">
              <div className="res-left">
                <span className="res-name">{page.name}</span>
                <span className="res-cat">{page.category}</span>
              </div>
              {page.date && <span className="res-date">{page.date}</span>}
            </a>
          ))}

          {/* 2. Menu Reset Tutorial (Selalu Muncul Paling Bawah) */}
          {/* Muncul jika query kosong ATAU query mengandung kata 'tutorial' */}
          {(!searchQuery || 'tutorial'.includes(searchQuery.toLowerCase())) && (
            <div 
              className="di-result-row tutorial-reset-row" 
              onClick={handleResetTutorial}
              style={{ 
                marginTop: '10px', 
                borderTop: '1px solid rgba(255,255,255,0.1)', 
                cursor: 'pointer' 
              }}
            >
              <div className="res-left">
                <span className="res-name" style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaRedo size={12}/> Reset Tutorial
                </span>
                <span className="res-cat">System</span>
              </div>
              <span className="res-date">Action</span>
            </div>
          )}

          {/* Pesan jika tidak ada hasil sama sekali (selain tutorial) */}
          {filteredPages.length === 0 && searchQuery && !'tutorial'.includes(searchQuery.toLowerCase()) && (
            <div className="di-no-res">No matches found.</div>
          )}
        </div>
      </div>
      
    </div>
  );
});

export default DynamicIsland;