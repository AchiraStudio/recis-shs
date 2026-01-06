import React from 'react';
import './OnboardingTutorial.css';

const OnboardingTutorial = ({ stepData, onNext, isLastStep }) => {
  const isWaiting = stepData.action === 'WAIT_ISLAND_ACTIVE';

  return (
    <div 
      className={`tutorial-overlay active ${stepData.islandMode ? 'island-mode' : ''}`}
      // Klik background tetap jalan, kecuali lagi nunggu island
      onClick={!isWaiting ? onNext : undefined} 
    >
      <div 
        className="tutorial-modal" 
        onClick={(e) => e.stopPropagation()} // Stop klik tembus ke background
      >
        
        {/* Karakter */}
        <div className="char-logo">
          <img src="/assets/achira.png" className='achira-logo' alt="" />
        </div>
        
        {/* WRAPPER CONTENT DENGAN KEY */}
        {/* Setiap teks berubah, div ini akan render ulang & trigger animasi slideUpFade */}
        <div key={stepData.text} className="fade-slide-in">
          
          <p className="tutorial-text">
            {stepData.text}
          </p>

          {/* Tombol */}
          <div style={{ marginTop: '20px' }}>
            {isWaiting ? (
              <button className="tutorial-btn waiting-input" disabled>
                Tekan tombol RSHS di atas ☝️
              </button>
            ) : (
              <button className="tutorial-btn" onClick={onNext}>
                {isLastStep ? "Mulai Petualangan 🚀" : "Lanjut"}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default OnboardingTutorial;