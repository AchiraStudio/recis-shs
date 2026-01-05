import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DynamicIsland from './components/DynamicI';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import About from './components/About';
import Crew from './components/Crew';
import Footer from './components/Footer';
import './App.css'

import Recup from './events/ascension/recup';
import Gallery from './events/gallery/Gallery';

import ErrorPage from './ErrorPage';

function LandingPage() {
  return (
    <>
      <Hero />
      <Timeline />
      <About />
      <Crew />
      <Footer></Footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <DynamicIsland />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/ascension-cup" element={<Recup />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;