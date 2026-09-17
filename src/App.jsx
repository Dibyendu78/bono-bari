import React, { useState, useEffect } from 'react';
import './index.css';
import './App.css';

import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import CafePage from './components/CafePage';
import BookingPage from './components/BookingPage';
import SatelliteMap from './components/SatelliteMap';
import TelemetryHUD from './components/TelemetryHUD';
import ResortCard from './components/ResortCard';
import BookingModal from './components/BookingModal';
import LiveReviews from './components/LiveReviews';

export default function App() {
  // Page route state: 'home' | 'cafe' | 'booking'
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (window.location.hash === '#cafe') return 'cafe';
    if (window.location.hash === '#booking' || window.location.hash === '#pricing') return 'booking';
    return 'home';
  });

  // Global Language state: 'en' (English) | 'bn' (Bengali)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('bonobari_lang') || 'en';
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const nextLang = prev === 'en' ? 'bn' : 'en';
      localStorage.setItem('bonobari_lang', nextLang);
      return nextLang;
    });
  };

  const [stage, setStage] = useState('HERO'); // 'HERO' | 'ZOOMING' | 'ARRIVED' | 'REVERSING'
  const [isSatelliteVisible, setIsSatelliteVisible] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStayType, setBookingStayType] = useState('Sal Forest Retreat Villa');
  const [telemetry, setTelemetry] = useState({
    progress: 0,
    altitude: 12800,
    sector: 'PLANET EARTH ORBIT',
    lat: 22.3752,
    lon: 87.0223
  });

  // Listen to browser hash changes (support back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#cafe') {
        setCurrentRoute('cafe');
      } else if (window.location.hash === '#booking' || window.location.hash === '#pricing') {
        setCurrentRoute('booking');
      } else if (window.location.hash === '' || window.location.hash === '#home') {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    if (route === 'cafe') {
      window.location.hash = 'cafe';
    } else if (route === 'booking') {
      window.location.hash = 'booking';
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch Google Earth dive: 3D globe begins smooth orbital push, seamlessly cross-fading into high-res satellite map
  const handleStartExplore = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTelemetry({
      progress: 0,
      altitude: 12800,
      sector: 'PLANET EARTH ORBIT',
      lat: 22.3752,
      lon: 87.0223
    });
    setStage('ZOOMING');
    setIsSatelliteVisible(true);
  };

  const handleFlightComplete = () => {
    setStage('ARRIVED');
  };

  const handleReturnToOrbit = () => {
    setStage('REVERSING');
    setTimeout(() => {
      setIsSatelliteVisible(false);
      setStage('HERO');
    }, 2000);
  };

  const handleOpenBooking = (stayType = 'Sal Forest Retreat Villa') => {
    setBookingStayType(stayType);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className={`app-container ${language === 'bn' ? 'lang-bn' : 'lang-en'}`}>
      {/* ─── GOOGLE HIGH-RESOLUTION SATELLITE DIVE (SEAMLESS FLIGHT INTO JHARGRAM) ─── */}
      <SatelliteMap
        stage={stage}
        isVisible={isSatelliteVisible}
        onFlightTelemetry={setTelemetry}
        onFlightComplete={handleFlightComplete}
        onReverseComplete={() => {
          setIsSatelliteVisible(false);
          setStage('HERO');
        }}
        language={language}
      />

      {/* ─── TELEMETRY HUD (ACTIVE DURING DESCENT) ───────────────────────────── */}
      {stage === 'ZOOMING' && (
        <TelemetryHUD
          telemetry={telemetry}
          onSkipToMap={handleFlightComplete}
          onCancel={handleReturnToOrbit}
        />
      )}

      {/* ─── ARRIVAL RESORT CARD (FLOATS OVER HIGH-RES GOOGLE SATELLITE VIEW) ──── */}
      {stage === 'ARRIVED' && (
        <ResortCard
          onReturnToOrbit={handleReturnToOrbit}
          onReturnToHome={handleReturnToOrbit}
          language={language}
        />
      )}

      {/* ─── DIRECT WHATSAPP BOOKING MODAL WINDOW (+91 7076973613) ──────────── */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialStayType={bookingStayType}
        language={language}
      />

      {/* ─── FLOATING LIVE BENGALI GUEST REVIEWS BADGE ───────────────────────── */}
      {stage === 'HERO' && currentRoute === 'home' && (
        <LiveReviews
          onBookNowClick={() => navigateTo('booking')}
        />
      )}

      {/* ─── CONDITIONAL PAGE ROUTING (HOME vs CAFE vs BOOKING) ──────────────── */}
      {currentRoute === 'cafe' ? (
        /* DEDICATED FULL PAGE: BONOBHOJ CAFE MENU & PRICE LIST */
        <CafePage
          onBackToHome={() => navigateTo('home')}
          onBookNowClick={() => navigateTo('booking')}
          language={language}
          onToggleLanguage={toggleLanguage}
        />
      ) : currentRoute === 'booking' ? (
        /* DEDICATED FULL PAGE: BOOKING & PRICING PLANS */
        <BookingPage
          onBackToHome={() => navigateTo('home')}
          onOpenBookingModal={handleOpenBooking}
          language={language}
          onToggleLanguage={toggleLanguage}
        />
      ) : (
        /* MAIN LANDING PAGE (STREAMLINED 5-SECTION LAYOUT) */
        <div>
          {/* 1. HERO SECTION WITH 3D EARTH, EXPLORE & BOOK NOW */}
          <HeroSection
            onExploreClick={handleStartExplore}
            onBookNowClick={() => navigateTo('booking')}
            onNavigateToCafe={() => navigateTo('cafe')}
            language={language}
            onToggleLanguage={toggleLanguage}
            stage={stage}
            onZoomComplete={handleFlightComplete}
            onReverseComplete={() => {
              setIsSatelliteVisible(false);
              setStage('HERO');
            }}
            telemetry={telemetry}
            onTelemetry={setTelemetry}
          />

          {/* 2. MARQUEE SECTION (3-ROW PHOTO GALLERY WITH POPUP LIGHTBOX) */}
          <MarqueeSection language={language} />

          {/* 3. ABOUT BONO BARI ECO RESORT (ANIMATED TEXT & 3D CORNER DECOR) */}
          <AboutSection
            onBookNowClick={() => navigateTo('booking')}
            language={language}
          />

          {/* 4. SERVICES SECTION (5 EXPERIENCES ON WHITE BACKGROUND) */}
          <ServicesSection
            language={language}
          />

          {/* 5. PROJECTS / STAY SECTION (15 BONO-BARI PHOTOS ON STACKING CARDS) */}
          <ProjectsSection
            onBookNowClick={() => navigateTo('booking')}
            language={language}
          />
        </div>
      )}
    </div>
  );
}
