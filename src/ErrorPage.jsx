import React from 'react';
import './ErrorPage.css'; // Make sure to save the CSS above in this file

const ErrorPage = () => {
  
  // Optional: Function to handle "Go Back"
  const handleGoBack = (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <section className="error-section">
      {/* Background Decorative Glow */}
      <div className="error-bg-glow"></div>

      <div className="error-container">
        
        {/* Left Side: Content */}
        <div className="error-text">
          <div className="error-pill">
            <span className="pill-dot-red"></span>
            <span>404 Error</span>
          </div>
          
          <h1 className="error-title">
            Lost in the <br /> Digital Void?
          </h1>
          
          <p className="error-desc">
            The page you are looking for has drifted into deep space. 
            It might have been removed, renamed, or is temporarily unavailable.
          </p>
          
          <div className="error-actions">
            {/* Replace href with your React Router Link if needed */}
            <a href="/" className="btn-primary-soft">
              Return Home
            </a>
            
            <a href="#" onClick={handleGoBack} className="btn-secondary-soft">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
              Go Back
            </a>
          </div>
        </div>

        {/* Right Side: Visuals (Floating Glass Widgets) */}
        <div className="error-visual">
          
          {/* Main Card (The Zero) */}
          <div className="glass-card card-main">
            <h2>0</h2>
            <span className="card-label">Null</span>
          </div>

          {/* Floating Card 1 (The first 4) */}
          <div className="glass-card card-float-1">
            <span className="card-number-small">4</span>
          </div>

          {/* Floating Card 2 (The second 4) */}
          <div className="glass-card card-float-2">
            <span className="card-number-small">4</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ErrorPage;