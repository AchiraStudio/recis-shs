import React, { useState } from 'react';
import './css/map-greek.css';
import { GiTreasureMap } from "react-icons/gi";
import { IoMdClose, IoMdExpand } from "react-icons/io";

const RecupMap = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <>
            <section className="map-section" id="map">
                <div className="map-spotlight"></div>

                <div className="map-container">
                    {/* LEFT CONTENT */}
                    <div className="map-content">
                        <div className="mp-label">
                            <GiTreasureMap size={18} /> THE ARENA
                        </div>
                        <h2 className="mp-title">VENUE MAP</h2>
                        <p className="mp-desc">
                            Explore the grounds of Ascension. Find your way to the stages, food stalls, and the main areas.
                        </p>
                    </div>

                    {/* VISUAL / MAP DISPLAY */}
                    <div
                        className="map-visual"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={() => setIsZoomed(true)}
                    >
                        <div className="visual-aura-map"></div>
                        <div className="map-frame">
                            <img
                                src="/assets/recup/map.png"
                                alt="Ascension Venue Map"
                                className="map-img"
                            />
                            <div className={`map-overlay-hint ${isHovering ? 'hidden' : ''}`}>
                                <span><IoMdExpand style={{ marginBottom: -4, marginRight: 8 }} size={24} /> CLICK TO ZOOM</span>
                            </div>
                        </div>
                        <div className="map-deco">MAP</div>
                    </div>
                </div>
            </section>

            {/* ZOOM MODAL */}
            {isZoomed && (
                <div className="map-zoom-modal" onClick={() => setIsZoomed(false)}>
                    <button className="map-close-btn" onClick={() => setIsZoomed(false)}>
                        <IoMdClose size={30} />
                    </button>
                    <div className="map-zoom-content" onClick={e => e.stopPropagation()}>
                        <img
                            src="/assets/recup/map.png"
                            alt="Ascension Venue Map Zoomed"
                            className="map-zoom-img"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default RecupMap;
