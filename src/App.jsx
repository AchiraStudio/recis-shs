import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DynamicIsland from './components/DynamicI';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import About from './components/About';
import Crew from './components/Crew';
import Footer from './components/Footer';

import Recup from './events/ascension/recup';
import Gallery from './events/gallery/Gallery';

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
        <DynamicIsland></DynamicIsland>
        <Routes>
          <Route path="/r-shs" element={<LandingPage />} />
          <Route path="/r-shs/gallery" element={<Gallery />} />
          <Route path="/r-shs/ascension-cup" element={<Recup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;