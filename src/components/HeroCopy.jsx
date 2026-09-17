import React from 'react';

export default function HeroCopy({
  onGetStarted,
  scrollProgress = 0,
  onToggleScroll
}) {
  // As scrollProgress goes from 0 to 1, hero copy fades smoothly
  const opacity = Math.max(0, 1 - scrollProgress * 2.2);
  const translateY = -scrollProgress * 60;
  const isWholeEarth = scrollProgress > 0.65;

  return (
    <>
      <div
        className="copy"
        style={{
          opacity: opacity,
          transform: `translateY(calc(var(--vshift) + ${translateY}px))`,
          pointerEvents: opacity < 0.1 ? 'none' : 'auto',
          transition: 'opacity 0.25s ease-out'
        }}
      >
        <div className="col eyebrow">
          <span className="ent-mask">
            <span className="ent-line">ECO SANCTUARY</span>
          </span>
        </div>

        <h1 className="col title">
          <span className="ent-mask">
            <span className="ent-line">BONO BARI</span>
          </span>
        </h1>

        <div className="col rule">
          <span></span>
        </div>

        <p className="col lede">
          Immerse yourself in the sacred Sal canopies of Jangal Khas, Jhargram, West Bengal. <br />
          Where sustainable forest luxury breathes with the ancient rhythm of planet Earth.
        </p>

        <div className="col cta" style={{ justifyContent: 'center' }}>
          <button
            className="get-started-btn"
            type="button"
            onClick={onGetStarted}
          >
            GET STARTED
          </button>
        </div>
      </div>

      {/* FLOATING WHOLE EARTH EXPLORER HUD (REVEALED WHEN SCROLLED DOWN) */}
      {isWholeEarth && (
        <div
          className="whole-earth-bar"
          style={{
            position: 'absolute',
            bottom: 'calc(36 * var(--u))',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(4, 16, 31, 0.82)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(121, 220, 232, 0.35)',
            borderRadius: 'calc(30 * var(--u))',
            padding: 'calc(10 * var(--u)) calc(22 * var(--u))',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(121, 220, 232, 0.15)',
            pointerEvents: 'auto',
            animation: 'ent-settle 0.4s cubic-bezier(0.22, 1, 0.36, 1) both'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--cyan)', fontWeight: 600 }}>
              Interactive 3D Earth
            </span>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>
              Drag to explore • Pulsing beacon at Jhargram
            </span>
          </div>

          <button
            type="button"
            onClick={onGetStarted}
            className="get-started-btn"
            style={{
              width: 'auto',
              height: 'calc(42 * var(--u))',
              padding: '0 calc(20 * var(--u))',
              fontSize: 'calc(13 * var(--u))',
              letterSpacing: '0.5px'
            }}
          >
            ZOOM TO RESORT
          </button>

          <button
            type="button"
            onClick={onToggleScroll}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#fff',
              borderRadius: 'calc(21 * var(--u))',
              height: 'calc(42 * var(--u))',
              padding: '0 calc(16 * var(--u))',
              fontSize: 'calc(12 * var(--u))',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s ease'
            }}
          >
            Overview ↑
          </button>
        </div>
      )}

      {/* SCROLL BUTTON (Toggles between horizon overview & whole earth view) */}
      <button
        className="scroll"
        type="button"
        aria-label={isWholeEarth ? "Return to overview" : "Scroll to view whole earth"}
        onClick={onToggleScroll}
        style={{
          transform: isWholeEarth ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        <svg viewBox="0 0 26 33" fill="none" aria-hidden="true">
          <path
            d="M13 1.5 V31.5 M1.9 20.4 L13 31.5 L24.1 20.4"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      </button>
    </>
  );
}
