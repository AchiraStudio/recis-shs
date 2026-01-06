import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import DynamicIsland from './components/DynamicI';
import OnboardingTutorial from './components/OnboardingTutorial'; 

import Hero from './components/Hero';
import Timeline from './components/Timeline';
import About from './components/About';
import Crew from './components/Crew';
import Footer from './components/Footer';

import GlobalBackground from './GlobalBackground';
import './App.css';

import Recup from './events/ascension/recup';
import Gallery from './events/gallery/Gallery';
import ErrorPage from './ErrorPage';

// --- DATA STEP TUTORIAL ---
const TUTORIAL_STEPS = [
  { 
    text: "Halo! Perkenalkan, aku Achira! Dan aku akan menjadi tour guide kamu", 
    action: null, 
    islandMode: false 
  },
  { 
    text: "Selamat datang di website official ASCENSION CUP! Tekan untuk melanjutkan", 
    action: null, 
    islandMode: false 
  },
  { 
    text: "Disini kalian bisa scroll-scroll biasa mencari info mengenai perlombaan, schedule, rundown, merch, dan juga guest stars. Tekan untuk melanjutkan", 
    action: null, 
    islandMode: false 
  },
  { 
    text: "Sekarang coba kalian tekan tombol RSHS yang ada di atas layar...", 
    action: 'WAIT_ISLAND_ACTIVE', 
    islandMode: true // Z-Index Tinggi agar bisa diklik
  },
  // --- STEP BARU: PENJELASAN SAAT ISLAND TERBUKA ---
  { 
    text: "Nah, disini kalian bisa explore menu navigasi seperti Instagram, Home, dan Search. Tekan untuk melanjutkan", 
    action: null, // Jangan close dulu! Biarkan user melihatnya.
    islandMode: true // PENTING: Tetap True agar Z-Index tetap tinggi dan tidak ketutupan overlay
  },
  // --------------------------------------------------
  { 
    text: "Sekarang Have fun! Sampai bertemu di perlombaan, dan juga di tanggal 24 Januari nanti. Tekan untuk melanjutkan", 
    action: 'CLOSE_ISLAND', // Baru tutup disini
    islandMode: false // Kembalikan ke normal
  },
  { 
    text: "Hati-hati di jalan uuuuuuu... yup, BYE", 
    action: 'FINISH', 
    islandMode: false 
  }
];

function LandingPage() {
  return (
    <>
      <GlobalBackground />
      <Hero />
      <Timeline />
      <About />
      <Crew />
      <Footer />
    </>
  );
}

function App() {
  // --- STATE ---
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [islandActive, setIslandActive] = useState(false);
  
  const islandRef = useRef(null); 

  // --- EFFECT: SHOW TUTORIAL ON LOAD ---
  useEffect(() => {
    // DEVELOPMENT MODE: Selalu muncul saat reload (Comment bagian localStorage)
    const hasSeen = localStorage.getItem('hasSeenAscensionTutorial');
    if (!hasSeen) {
      setTimeout(() => setShowTutorial(true), 1000);
    }
  }, []);

  // --- LOGIC: AUTO-NEXT SAAT ISLAND DITEKAN ---
  useEffect(() => {
    const currentStep = TUTORIAL_STEPS[tutorialStep];
    
    // Jika sedang menunggu user klik island, dan island aktif...
    if (showTutorial && currentStep?.action === 'WAIT_ISLAND_ACTIVE' && islandActive) {
      // Delay sedikit agar animasi island terbuka selesai dulu baru teks tutorial berubah
      setTimeout(() => {
        setTutorialStep((prev) => prev + 1);
      }, 600); 
    }
  }, [islandActive, tutorialStep, showTutorial]);

  // --- HANDLER: PINDAH STEP ---
  const handleNextStep = () => {
    const currentStep = TUTORIAL_STEPS[tutorialStep];

    // Block next manual jika sedang menunggu klik island
    if (currentStep.action === 'WAIT_ISLAND_ACTIVE') return;

    // Jika step ini meminta Island ditutup (Step "Have Fun")
    if (currentStep.action === 'CLOSE_ISLAND') {
      if (islandRef.current) islandRef.current.collapse();
    }

    // Jika Finish
    if (currentStep.action === 'FINISH') {
      setShowTutorial(false);
      localStorage.setItem('hasSeenAscensionTutorial', 'true');
      return;
    }

    // Lanjut ke step berikutnya
    setTutorialStep((prev) => prev + 1);
  };

  const handleIslandToggle = (isActive) => {
    setIslandActive(isActive);
  };

  return (
    <Router>
      <div className="app-wrapper">
        
        {/* Dynamic Island */}
        <DynamicIsland 
          ref={islandRef}
          onToggle={handleIslandToggle}
          // Z-Index Override aktif jika step tutorial memintanya (islandMode: true)
          zIndexOverride={showTutorial && TUTORIAL_STEPS[tutorialStep].islandMode}
        />

        {/* Tutorial Overlay */}
        {showTutorial && (
          <OnboardingTutorial 
            stepData={TUTORIAL_STEPS[tutorialStep]}
            onNext={handleNextStep}
            isLastStep={tutorialStep === TUTORIAL_STEPS.length - 1}
          />
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/ascension-cup" replace />} />
          <Route path="/r-shs" element={<LandingPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/ascension-cup" element={<Recup />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;