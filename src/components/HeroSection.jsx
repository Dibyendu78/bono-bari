import React from 'react';
import { Compass, MapPin, Calendar, Globe } from 'lucide-react';
import { FadeIn, ContactButton } from './SharedComponents';
import EarthGlobe from './EarthGlobe';
import { TRANSLATIONS } from '../translations';
import './HeroSection.css';

export default function HeroSection({
  onExploreClick,
  onBookNowClick,
  onNavigateToCafe,
  language = 'en',
  onToggleLanguage,
  stage = 'HERO',
  onZoomComplete,
  onReverseComplete,
  telemetry,
  onTelemetry
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isBn = language === 'bn';
  const isExploring = stage !== 'HERO';

  const navItems = [
    { label: t.navAbout, href: '#about' },
    { label: t.navCafe, href: '#cafe' },
    { label: t.navExperiences, href: '#services' },
    { label: t.navStay, href: '#projects' },
    { label: t.navContact, href: '#contact' }
  ];

  return (
    <section className={`hero-section ${isBn ? 'font-bengali' : ''}`}>
      {/* Background celestial gradient */}
      <div className="hero-bg-cosmos" />

      {/* 1. Navbar */}
      <FadeIn delay={0} y={-20} className={`hero-navbar-wrap hero-ui-fading ${isExploring ? 'is-faded-out' : ''}`}>
        <nav className="hero-navbar">
          <div className="hero-nav-links-group">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hero-nav-link"
                onClick={(e) => {
                  if (item.href === '#cafe') {
                    e.preventDefault();
                    if (onNavigateToCafe) onNavigateToCafe();
                  }
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hero-nav-actions">
            {/* Language Switcher Toggle (Bengali / English) */}
            <button
              type="button"
              className="hero-lang-toggle-btn"
              onClick={onToggleLanguage}
              title={isBn ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
            >
              <Globe size={14} className="hero-lang-globe-icon" />
              <span className="hero-lang-label">
                {isBn ? 'EN' : 'বাংলা'}
              </span>
            </button>

            {/* Quick Book Button in Nav */}
            <button
              type="button"
              className="hero-nav-book-btn"
              onClick={onBookNowClick}
            >
              <Calendar size={14} />
              <span>{t.navBookNow}</span>
            </button>
          </div>
        </nav>
      </FadeIn>

      {/* 2. Hero Heading */}
      <div className={`hero-heading-container hero-ui-fading ${isExploring ? 'is-faded-out' : ''}`}>
        <FadeIn delay={0.15} y={40}>
          <div className="hero-brand-wrap">
            <h1 className="hero-heading hero-heading-text">
              {t.heroTitle}
            </h1>
          </div>
        </FadeIn>
      </div>

      {/* 3. Hero 3D Earth (Smooth in-place zoom straight into Jhargram coordinates) */}
      <div className={`hero-earth-positioner ${isExploring ? 'is-exploring' : ''}`}>
        <FadeIn delay={0.5} y={0} style={{ width: '100%', height: '100%', position: 'relative' }}>
          <EarthGlobe
            stage={stage}
            onZoomComplete={onZoomComplete}
            onReverseComplete={onReverseComplete}
            onTelemetry={onTelemetry}
            language={language}
          />

          {/* Under the Earth: Eco Resort Pill + Explore Coordinate Badge */}
          <div className={`earth-under-badges-wrap hero-ui-fading ${isExploring ? 'is-faded-out' : ''}`}>
            <div className="hero-eco-resort-banner">
              <span className="hero-eco-leaf">🌿</span>
              <span className="hero-eco-text">{t.heroSubtitle}</span>
              <span className="hero-eco-leaf">🌿</span>
            </div>

            <button
              type="button"
              onClick={onExploreClick}
              className="earth-explore-badge"
              title="Click to zoom directly into Jhargram resort coordinates"
            >
              <MapPin size={13} className="pin-pulse-icon" />
              <span>{t.heroCoordinates}</span>
              <span className="badge-arrow">→</span>
            </button>
          </div>
        </FadeIn>
      </div>

      {/* 4. Bottom Bar */}
      <div className={`hero-bottom-bar hero-ui-fading ${isExploring ? 'is-faded-out' : ''}`}>
        {/* Left: Tagline */}
        <FadeIn delay={0.35} y={20}>
          <div className="hero-tagline-wrap">
            <p className="hero-tagline">
              {t.heroTagline}
            </p>
          </div>
        </FadeIn>

        {/* Right: Actions Group (Explore Location + Book Now) */}
        <div className="hero-actions-group">
          {/* Primary Explore Location Flight Button */}
          <FadeIn delay={0.45} y={20}>
            <button
              type="button"
              className="explore-location-btn"
              onClick={onExploreClick}
              title="Zoom directly into Bono Bari, Jhargram on the 3D Earth"
            >
              <Compass size={18} className="explore-icon-pulse" />
              <span>{t.heroExploreBtn}</span>
            </button>
          </FadeIn>

          {/* Book Now Button (opens booking modal) */}
          <FadeIn delay={0.55} y={20}>
            <ContactButton
              label={t.heroBookBtn}
              onClick={onBookNowClick}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
