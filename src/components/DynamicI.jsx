import { useState, useEffect, useRef } from 'react';
import { FaInstagram, FaSearch, FaGlobe } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import * as XLSX from 'xlsx';
import './DynamicIsland.css';
import './SearchBox.css';

const DynamicIsland = ({ onInstagramClick, theme = '' }) => {
  const [isActive, setIsActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  // Search States
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchExiting, setIsSearchExiting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  
  const islandRef = useRef(null);
  const searchInputRef = useRef(null);

  // 1. Load Excel Data Once
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
        console.warn('Excel load failed (using fallback data or empty):', error);
      }
    };
    loadData();
  }, []);

  // 2. Scroll Detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Click Outside Logic
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target)) {
        if (showSearch) closeSearch();
        else if (isActive) collapseIsland();
      }
    };
    document.addEventListener('mousedown', handleClickOutside); // mousedown is faster than click
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActive, showSearch]);

  // --- Handlers ---

  const toggleIsland = (e) => {
    // If search is open, don't toggle island, just do nothing or focus search
    if (showSearch) return;
    
    if (isActive) collapseIsland();
    else setIsActive(true);
  };

  const collapseIsland = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsActive(false);
      setIsExiting(false);
    }, 300); // Match CSS animation duration
  };

  const openSearch = () => {
    setIsActive(true); // Ensure island stays "visually" active or expands
    setShowSearch(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const closeSearch = () => {
    setIsSearchExiting(true);
    setSearchQuery(''); // Optional: clear search on close
    setTimeout(() => {
      setShowSearch(false);
      setIsSearchExiting(false);
      collapseIsland(); // Also collapse the island for a clean exit
    }, 250); // Match search exit animation
  };

  const handleAction = (e, action) => {
    e.stopPropagation(); // Prevent island toggle
    switch (action) {
      case 'instagram':
        onInstagramClick?.() || window.open('https://instagram.com/rshs', '_blank');
        break;
      case 'main':
        window.location.href = '/';
        break;
      case 'search':
        openSearch();
        break;
      default: break;
    }
  };

  // Search Filtering
  useEffect(() => {
    if (!searchQuery) {
      setFilteredPages(pages);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = pages.filter(page =>
        (page.name || '').toLowerCase().includes(lowerQuery) ||
        (page.category || '').toLowerCase().includes(lowerQuery)
      );
      setFilteredPages(filtered);
    }
  }, [searchQuery, pages]);

  return (
    <div 
      className={`dynamic-island-wrapper ${isScrolled ? 'scrolled' : ''} ${theme}`} 
      ref={islandRef}
    >
      {/* The Black Pill (Island) */}
      <div
        className={`di-pill ${isActive ? 'expanded' : ''} ${isExiting ? 'shrinking' : ''}`}
        onClick={toggleIsland}
      >
        {/* Idle State (Small Pill) */}
        <div className="di-content-idle">
          <div className="di-signal-dot"></div>
          <span className="di-label">RSHS</span>
        </div>

        {/* Expanded State (Icons) */}
        <div className="di-content-active">
          <button className="di-btn" onClick={(e) => handleAction(e, 'instagram')} aria-label="Instagram">
            <FaInstagram />
          </button>
          <div className="di-separator"></div>
          <button className="di-btn" onClick={(e) => handleAction(e, 'main')} aria-label="Home">
            <FaGlobe />
          </button>
          <div className="di-separator"></div>
          <button className="di-btn" onClick={(e) => handleAction(e, 'search')} aria-label="Search">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Search Dropdown (Absolute positioned below pill) */}
      {(showSearch || isSearchExiting) && (
        <div className={`di-search-container ${isSearchExiting ? 'closing' : 'opening'}`}>
          <div className="di-search-box">
            <div className="search-header">
              <FaSearch className="search-icon-input" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <button className="close-btn" onClick={(e) => { e.stopPropagation(); closeSearch(); }}>
                <FiX />
              </button>
            </div>

            <div className="search-results-list" onClick={(e) => e.stopPropagation()}>
              {filteredPages.length > 0 ? (
                filteredPages.map((page, i) => (
                  <a key={i} href={page.link || '#'} className="result-item">
                    <div className="result-info">
                      <span className="result-title">{page.name || page.title}</span>
                      <span className="result-cat">{page.category || 'General'}</span>
                    </div>
                    {page.date && <span className="result-date">{page.date}</span>}
                  </a>
                ))
              ) : (
                <div className="no-results">No events found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicIsland;