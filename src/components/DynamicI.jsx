import { useState, useEffect, useRef } from 'react';
import { FaInstagram, FaSearch, FaGlobe } from "react-icons/fa";
import * as XLSX from 'xlsx';
import './DynamicIsland.css';
import './DynamicIsland-greek.css'; // Import the new Greek theme

const DynamicIsland = ({ onInstagramClick, theme = '' }) => {
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

  // 1. Load Excel Data (with fallback)
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
        // Fallback for demo purposes
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
    if (showSearch) return; // Don't toggle if search is open
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
    >
      {/* THE ISLAND PILL */}
      <div 
        className={`di-pill ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''} ${showSearch ? 'search-mode' : ''}`}
        onClick={toggleIsland}
      >
        <div className="di-content">
          
          {/* Idle State */}
          <div className="di-idle">
            <div className="di-signal"></div>
            <span className="di-label">RSHS</span>
          </div>

          {/* Active Menu State */}
          <div className="di-menu">
            <button onClick={(e) => handleAction(e, 'instagram')} aria-label="IG">
              <FaInstagram />
            </button>
            <div className="di-divider"></div>
            <button onClick={(e) => handleAction(e, 'home')} aria-label="Home">
              <FaGlobe />
            </button>
            <div className="di-divider"></div>
            <button onClick={(e) => handleAction(e, 'search')} aria-label="Search">
              <FaSearch />
            </button>
          </div>

        </div>
      </div>

      {/* SEARCH DROPDOWN */}
      <div className={`di-search-panel ${showSearch ? 'open' : ''}`}>
        <div className="di-search-input-wrap">
          {/* <FaSearch className="search-icon" /> */}
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="di-results">
          {filteredPages.length > 0 ? (
            filteredPages.map((page, i) => (
              <a key={i} href={page.link || '#'} className="di-result-row">
                <div className="res-left">
                  <span className="res-name">{page.name}</span>
                  <span className="res-cat">{page.category}</span>
                </div>
                {page.date && <span className="res-date">{page.date}</span>}
              </a>
            ))
          ) : (
            <div className="di-no-res">No matches found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicIsland;