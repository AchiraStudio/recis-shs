import React from 'react';
import './App.css'; // Ensure styles are loaded

const GlobalBackground = () => {
  return (
    <div className="fixed-bg" aria-hidden="true">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
    </div>
  );
};

export default GlobalBackground;