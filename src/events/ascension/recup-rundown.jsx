import React from 'react';
import './css/rundown-greek.css';
import { GiHourglass, GiMicrophone } from "react-icons/gi";

const RecupRundown = () => {
    const schedule = [
        { time: "13.00 – 15.00", agenda: "Open Gate" },
        { time: "13.30 – 14.30", agenda: "Pengumuman Lomba" },
        { time: "14.30 – 15.00", agenda: "Sambutan" },
        { time: "15.00 – 15.15", agenda: "Break" },
        { time: "15.15 – 15.30", agenda: "Existence" },
        { time: "15.40 – 15.55", agenda: "Aquila" },
        { time: "15.55 – 16.15", agenda: "Bandit" },
        { time: "16.25 – 16.40", agenda: "The Strange Harmony" },
        { time: "16.40 – 17.00", agenda: "Matriks" },
        { time: "17.00 – 17.15", agenda: "Unnamed" },
        { time: "17.15 – 17.55", agenda: "J!BAND!" },
        { time: "17.55 – 18.30", agenda: "Break" },
        { time: "18.30 – 19.35", agenda: "Tulus" },
    ];

    return (
        <section className="rundown-section" id="rundown">
            <div className="rundown-container">
                <div className="rd-header">
                    <div className="rd-label">
                        <GiHourglass size={18} /> THE CHRONICLES
                    </div>
                    <h2 className="rd-title">CLOSING RUNDOWN</h2>
                    <p className="rd-subtitle">ASCENSION DAY I</p>
                </div>

                <div className="rd-list-wrapper">
                    <div className="rd-list">
                        <div className="rd-row header">
                            <span className="rd-time-h">TIME</span>
                            <span className="rd-agenda-h">AGENDA</span>
                        </div>
                        {schedule.map((item, idx) => (
                            <div key={idx} className="rd-row item">
                                <span className="rd-time">{item.time}</span>
                                <span className="rd-agenda">{item.agenda}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rd-footer">
                    <div className="mc-box">
                        <GiMicrophone size={24} className="mc-icon" />
                        <span className="mc-label">MASTER OF CEREMONY:</span>
                        <span className="mc-name">Ringga Helmi <span className="mc-handle">(@cagahelmi)</span></span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecupRundown;
