import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './Gallery.css';
import DynamicIsland from '../../components/DynamicI';
import galleryData from '../../data/events.json';

// Lightweight Icon Component
const Icon = ({ name, size = 20, className = '' }) => {
  const icons = {
    search: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    arrowLeft: <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />,
    arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
    close: <path d="M6 18L18 6M6 6l12 12" />,
    play: <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />,
    pause: <path d="M10 9v6m4-6v6" />,
    image: <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} height={size} 
      fill="none" viewBox="0 0 24 24" 
      stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
      className={className}
    >
      {icons[name]}
    </svg>
  );
};

function Gallery() {
  const [currentView, setCurrentView] = useState('albums'); 
  const [selectedAlbumKey, setSelectedAlbumKey] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const audioRef = useRef(null);

  // Memoize album selection to prevent recalc
  const selectedAlbum = useMemo(() => {
    return (selectedAlbumKey && galleryData?.events) ? galleryData.events[selectedAlbumKey] : null;
  }, [selectedAlbumKey]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedAlbumKey]);

  // Audio Handler
  useEffect(() => {
    if (!audioRef.current) return;
    const playAudio = async () => {
      try {
        if (isPlaying) await audioRef.current.play();
        else audioRef.current.pause();
      } catch (err) {
        console.log("Audio autoplay prevented by browser");
        setIsPlaying(false);
      }
    };
    playAudio();
  }, [isPlaying]);

  const handleOpenAlbum = (key) => {
    setSelectedAlbumKey(key);
    setCurrentView('album');
  };

  const handleBack = () => {
    setCurrentView('albums');
    // Small timeout to allow transition before clearing state
    setTimeout(() => setSelectedAlbumKey(null), 300);
    setIsPlaying(false);
  };

  // Lightbox Handlers
  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const navigateImage = useCallback((direction) => {
    if (!selectedAlbum?.galleryImages) return;
    const len = selectedAlbum.galleryImages.length;
    setSelectedImageIndex(prev => direction === 'next' ? (prev + 1) % len : (prev - 1 + len) % len);
  }, [selectedAlbum]);

  // Keyboard support for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isLightboxOpen, navigateImage, closeLightbox]);

  const filteredAlbums = Object.entries(galleryData?.events || {}).filter(([_, album]) => 
    album.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!galleryData?.events) return <div className="loader">Loading Archive...</div>;

  return (
    <>
      <DynamicIsland />
      
      <div className="gallery-layout">
        <div className="ambient-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          {/* Noise overlay removed on mobile via CSS for performance */}
          <div className="noise-overlay"></div>
        </div>

        {/* --- ALBUMS LIST --- */}
        <main className={`view-container ${currentView === 'albums' ? 'active' : 'hidden'}`}>
          <header className="gallery-header">
            <div>
              <span className="brand-subtitle">R-SHS ARCHIVE</span>
              <h1 className="brand-title">Collections</h1>
            </div>
            
            <div className="search-wrapper">
              <Icon name="search" className="search-icon" />
              <input
                type="text"
                placeholder="Find a memory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </header>

          <div className="albums-grid">
            {filteredAlbums.map(([key, album]) => (
              <article 
                key={key} 
                className="album-card"
                onClick={() => handleOpenAlbum(key)}
              >
                <div className="card-media-wrapper">
                  <img 
                    src={album.coverImage} 
                    alt={album.title} 
                    loading="lazy"
                    onError={(e) => e.target.src = 'https://placehold.co/600x400/1a1a2e/FFF?text=No+Image'}
                  />
                  <div className="card-overlay">
                    <span>Open Album</span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="card-meta">
                    <span className="date-badge">{album.date || 'Archives'}</span>
                    <span className="count-badge">{album.galleryImages?.length || 0} Items</span>
                  </div>
                  <h2 className="card-title">{album.title}</h2>
                  <p className="card-desc">{album.description}</p>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* --- SINGLE ALBUM --- */}
        <main className={`view-container ${currentView === 'album' ? 'active' : 'hidden'}`}>
          {selectedAlbum && (
            <>
              <nav className="sticky-nav">
                <button onClick={handleBack} className="glass-btn back-btn">
                  <Icon name="arrowLeft" /> Back
                </button>
                
                {selectedAlbum.audioSrc && (
                  <button 
                    className={`glass-btn audio-btn ${isPlaying ? 'active' : ''}`}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <Icon name={isPlaying ? "pause" : "play"} size={16} />
                    <span className="desktop-only">{isPlaying ? 'Playing...' : 'Soundtrack'}</span>
                    {isPlaying && <div className="mini-eq"><span></span><span></span><span></span></div>}
                  </button>
                )}
              </nav>

              <header className="album-header">
                <h1 className="album-title">{selectedAlbum.title}</h1>
                <p className="album-meta">{selectedAlbum.description}</p>
              </header>

              <div className="masonry-grid">
                {selectedAlbum.galleryImages?.map((img, index) => (
                  <div key={index} className="masonry-item" onClick={() => openLightbox(index)}>
                    <img 
                      src={img.src} 
                      alt={img.alt || `Photo ${index}`}
                      loading="lazy" 
                    />
                  </div>
                ))}
              </div>

              {selectedAlbum.audioSrc && (
                <audio ref={audioRef} src={selectedAlbum.audioSrc} loop />
              )}
            </>
          )}
        </main>

        {/* --- LIGHTBOX --- */}
        {isLightboxOpen && selectedAlbum && (
          <div className="lightbox" onClick={closeLightbox}>
            <button className="lb-close"><Icon name="close" size={24} /></button>
            
            <div className="lb-content" onClick={e => e.stopPropagation()}>
              <img 
                src={selectedAlbum.galleryImages[selectedImageIndex]?.src} 
                alt="Full screen"
                className="lb-img"
              />
              <div className="lb-controls">
                <button className="lb-arrow" onClick={() => navigateImage('prev')}>
                  <Icon name="arrowLeft" size={28} />
                </button>
                <div className="lb-text">
                  {selectedImageIndex + 1} / {selectedAlbum.galleryImages.length}
                </div>
                <button className="lb-arrow" onClick={() => navigateImage('next')}>
                  <Icon name="arrowRight" size={28} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Gallery;