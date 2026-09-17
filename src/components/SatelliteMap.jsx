import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SatelliteMap.css';

// Exact coordinates for Bono Bari Eco Resort (Jangal Khas, Jhargram, West Bengal)
const RESORT_COORDS = [22.37519, 87.02231];
const START_CENTER  = [22.8, 86.5];  // Continental & Eastern India regional view
const START_ZOOM    = 4;             // Continental starting altitude
const TARGET_ZOOM   = 17;            // Ultra high-res satellite level at Bono Bari resort

const TOTAL_DURATION = 3.8; // Smooth uninterrupted cinematic dive (zero steps, zero pauses)

export default function SatelliteMap({
  stage,          // 'HERO' | 'ZOOMING' | 'ARRIVED' | 'REVERSING'
  isVisible,      // CSS visibility cross-fade
  onFlightTelemetry,
  onFlightComplete,
  onReverseComplete,
  language = 'en'
}) {
  const mapContainerRef = useRef(null);
  const mapRef          = useRef(null);
  const markerRef       = useRef(null);
  const flyStartedRef   = useRef(false);
  const telRafRef       = useRef(null);

  // ── Pre-warm Google satellite tiles for Jhargram on mount ───────────────────
  useEffect(() => {
    const preloadUrls = [
      'https://mt1.google.com/vt/lyrs=y&x=12152&y=7146&z=14',
      'https://mt2.google.com/vt/lyrs=y&x=24304&y=14293&z=15',
      'https://mt3.google.com/vt/lyrs=y&x=48609&y=28587&z=16',
      'https://mt0.google.com/vt/lyrs=y&x=97219&y=57174&z=17',
      'https://mt1.google.com/vt/lyrs=y&x=97220&y=57174&z=17',
      'https://mt2.google.com/vt/lyrs=y&x=97219&y=57175&z=17',
      'https://mt3.google.com/vt/lyrs=y&x=97220&y=57175&z=17'
    ];
    preloadUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // ── Init Leaflet Map Once ───────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center:             START_CENTER,
      zoom:               START_ZOOM,
      minZoom:            3,
      maxZoom:            20,
      zoomControl:        false,
      attributionControl: false,
      fadeAnimation:      true,
      zoomAnimation:      true,
      inertia:            true,
      worldCopyJump:      false,
    });

    // 1. Google High-Speed Satellite Hybrid Tiles
    const googleSat = L.tileLayer(
      'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        maxNativeZoom: 19,
        keepBuffer: 16,
        updateWhenIdle: false,
      }
    ).addTo(map);

    // 2. Fallback / supplementary Esri satellite layer if Google is blocked
    googleSat.on('tileerror', () => {
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, keepBuffer: 8 }
      ).addTo(map);
    });

    // Custom pulsing resort beacon marker
    const isBn = language === 'bn';
    const pulsingIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div class="pin-radar-ring"></div>
        <div class="pin-radar-ring-2"></div>
        <div class="pin-core"></div>
        <div class="pin-label-pill">${isBn ? '🌿 বোনো বাড়ি ইকো রিসর্ট' : '🌿 Bono Bari Eco Resort'}</div>
      `,
      iconSize:   [60, 60],
      iconAnchor: [30, 30],
    });

    const marker = L.marker(RESORT_COORDS, { icon: pulsingIcon }).addTo(map);

    const popupHtml = `
      <div class="satellite-popup-card ${isBn ? 'font-bengali' : ''}">
        <div class="satellite-popup-badge">🌿 ${isBn ? 'ইকো রিসর্ট' : 'ECO RESORT'}</div>
        <h3 class="satellite-popup-title">${isBn ? 'বোনো বাড়ি ইকো রিসর্ট' : 'Bono Bari Eco Resort'}</h3>
        <p class="satellite-popup-loc">${isBn ? 'জঙ্গল খাস, ঝাড়গ্রাম, পশ্চিমবঙ্গ ৭২১৫১৪' : 'Jangal Khas, Jhargram, West Bengal 721514'}</p>
        <div class="satellite-popup-coords">
          <span>LAT: 22.3752° N</span>
          <span>LON: 87.0223° E</span>
        </div>
        <a href="https://wa.me/917076973613" target="_blank" rel="noopener noreferrer" class="satellite-popup-wa-btn">
          ${isBn ? 'হোয়াটসঅ্যাপে সরাসরি যোগাযোগ (+91 7076973613)' : 'WhatsApp Direct: +91 7076973613'}
        </a>
      </div>
    `;
    marker.bindPopup(popupHtml, { className: 'satellite-custom-popup', maxWidth: 320 });
    markerRef.current = marker;

    L.control.zoom({ position: 'topright' }).addTo(map);
    mapRef.current = map;

    setTimeout(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    }, 200);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [language]);

  // ── Single Continuous Smooth Flight (Zero Step-by-Step) ─────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (stage === 'ZOOMING') {
      if (flyStartedRef.current) return;
      flyStartedRef.current = true;

      map.invalidateSize();
      map.setView(START_CENTER, START_ZOOM, { animate: false });

      const t0 = performance.now();

      // Continuous telemetry progress animation
      const tickTelemetry = (now) => {
        const elapsed = (now - t0) / 1000;
        const frac    = Math.min(1.0, elapsed / TOTAL_DURATION);
        // Exponential altitude descent curve
        const altKm   = Math.max(120, Math.round(12800 * Math.pow(1 - frac, 2.4)));

        let sector = 'PLANET EARTH ORBIT';
        if (frac > 0.82)      sector = 'JHARGRAM • SAL CANOPY';
        else if (frac > 0.52)  sector = 'WEST BENGAL FORESTS';
        else if (frac > 0.22)  sector = 'INDIAN SUBCONTINENT';

        onFlightTelemetry?.({
          progress: frac,
          altitude: altKm,
          sector,
          lat: RESORT_COORDS[0],
          lon: RESORT_COORDS[1]
        });

        if (frac < 1.0) {
          telRafRef.current = requestAnimationFrame(tickTelemetry);
        }
      };
      telRafRef.current = requestAnimationFrame(tickTelemetry);

      // Smooth cinematic flyTo to Bono Bari — one uninterrupted velocity curve
      map.flyTo(RESORT_COORDS, TARGET_ZOOM, {
        duration: TOTAL_DURATION,
        easeLinearity: 0.22,
        noMoveStart: false
      });

      const onMoveEnd = () => {
        map.off('moveend', onMoveEnd);
        cancelAnimationFrame(telRafRef.current);
        if (markerRef.current) {
          markerRef.current.openPopup();
        }
        onFlightComplete?.();
      };

      map.on('moveend', onMoveEnd);

      return () => {
        cancelAnimationFrame(telRafRef.current);
        map.off('moveend', onMoveEnd);
      };
    }

    if (stage === 'REVERSING') {
      flyStartedRef.current = false;
      cancelAnimationFrame(telRafRef.current);

      map.flyTo(START_CENTER, START_ZOOM, {
        duration: 2.0,
        easeLinearity: 0.24,
      });

      const onRevEnd = () => {
        map.off('moveend', onRevEnd);
        onReverseComplete?.();
      };
      map.on('moveend', onRevEnd);

      return () => map.off('moveend', onRevEnd);
    }

    if (stage === 'HERO') {
      flyStartedRef.current = false;
    }
  }, [stage, onFlightComplete, onReverseComplete, onFlightTelemetry]);

  return (
    <div
      className={`satellite-container ${isVisible ? 'is-active' : ''}`}
    >
      <div ref={mapContainerRef} className="satellite-map-mount" />

      {/* Futuristic Target Acquisition Crosshair Overlay */}
      {stage === 'ZOOMING' && (
        <div className="satellite-crosshair-hud">
          <div className="satellite-crosshair-reticle" />
          <div className="satellite-crosshair-scanline" />
          <div className="satellite-lock-label">
            <span className="satellite-pulse-dot" />
            <span>GOOGLE EARTH SATELLITE: JHARGRAM [22.3752° N, 87.0223° E]</span>
          </div>
        </div>
      )}
    </div>
  );
}
