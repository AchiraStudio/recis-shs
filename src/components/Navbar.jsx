import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div className="brand">
          <h1 className="brand-logo">RSHS</h1>
        </div>
        <ul className="nav-links">
          <li><a href="#hero">Overview</a></li>
          <li><a href="#events">Academics</a></li>
          <li><a href="#about">Philosophy</a></li>
          <li><a href="#crew">Community</a></li>
        </ul>
        <div className="nav-cta">
          <button className="btn-glass">Portal</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;