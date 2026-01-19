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

  // Gallery.jsx
  return (
    <>
      <DynamicIsland />

      <div className="gallery-view-layout">
        <div className="gallery-ambient-background">
          <div className="gallery-mesh-gradient"></div>
        </div>

        {/* --- ALBUMS LIST --- */}
        <main className={`gallery-view-container ${currentView === 'albums' ? 'active' : 'hidden'}`}>
          <header className="gallery-sticky-header-glass">
            <div className="gallery-header-top">
              <h1 className="gallery-brand-title">ARCHIVES</h1>
              <div className="gallery-header-decoration"></div>
            </div>

            <div className="gallery-search-pill">
              <Icon name="search" className="gallery-search-icon" />
              <input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="gallery-search-input"
              />
            </div>
          </header>

          <div className="gallery-albums-mosaic">
            {filteredAlbums.map(([key, album]) => (
              <article
                key={key}
                className="gallery-album-card-premium"
                onClick={() => handleOpenAlbum(key)}
              >
                <div className="gallery-card-media">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    loading="lazy"
                    onError={(e) => e.target.src = 'https://placehold.co/600x400/1a1a2e/FFF?text=No+Image'}
                  />
                  <div className="gallery-media-overlay"></div>
                </div>
                <div className="gallery-card-info">
                  <span className="gallery-album-date">{album.date || '2024'}</span>
                  <h2 className="gallery-album-name">{album.title}</h2>
                  <div className="gallery-album-count-badge">{album.galleryImages?.length || 0}</div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* --- SINGLE ALBUM --- */}
        <main className={`gallery-view-container ${currentView === 'album' ? 'active' : 'hidden'}`}>
          {selectedAlbum && (
            <>
              <nav className="gallery-album-nav gallery-glass-nav">
                <button onClick={handleBack} className="gallery-nav-btn back">
                  <Icon name="arrowLeft" />
                  <span className="gallery-nav-text">Back to Archives</span>
                </button>

                {selectedAlbum.audioSrc && (
                  <button
                    className={`gallery-nav-btn audio ${isPlaying ? 'playing' : ''}`}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying && <div className="gallery-audio-wave"><span></span><span></span><span></span></div>}
                    <span className="gallery-nav-text">{isPlaying ? 'Playing Ambient' : 'Play Ambient'}</span>
                    <Icon name={isPlaying ? "pause" : "play"} size={16} />
                  </button>
                )}
              </nav>

              <header className="gallery-album-hero">
                <div className="gallery-hero-text-content">
                  <h1 className="gallery-hero-title">{selectedAlbum.title}</h1>
                  <p className="gallery-hero-desc">{selectedAlbum.description}</p>
                </div>
              </header>

              <div className="gallery-masonry-grid">
                {selectedAlbum.galleryImages?.map((img, index) => (
                  <div key={index} className="gallery-pm-item" onClick={() => openLightbox(index)}>
                    <img
                      src={img.src}
                      alt={img.alt || `Photo ${index}`}
                      loading="lazy"
                    />
                    <div className="gallery-item-hover-indicator"></div>
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
          <div className="gallery-lightbox-premium" onClick={closeLightbox}>
            <div className="gallery-lightbox-backdrop"></div>
            <button className="gallery-lb-close-btn"><Icon name="close" size={24} /></button>

            <div className="gallery-lb-stage" onClick={e => e.stopPropagation()}>
              <img
                src={selectedAlbum.galleryImages[selectedImageIndex]?.src}
                alt="Full screen"
                className="gallery-lb-image-main"
              />

              <div className="gallery-lb-navigation-bar">
                <button className="gallery-nav-arrow prev" onClick={() => navigateImage('prev')}>
                  <Icon name="arrowLeft" size={24} />
                </button>
                <span className="gallery-image-counter">
                  {selectedImageIndex + 1} <span className="gallery-divider">/</span> {selectedAlbum.galleryImages.length}
                </span>
                <button className="gallery-nav-arrow next" onClick={() => navigateImage('next')}>
                  <Icon name="arrowRight" size={24} />
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