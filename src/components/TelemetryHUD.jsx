import React from 'react';
import { Compass, Crosshair } from 'lucide-react';
import './TelemetryHUD.css';

export default function TelemetryHUD({
  telemetry,
  onSkipToMap,
  onCancel
}) {
  const { progress = 0, altitude = 12800, sector = 'ORBIT', lat = 22.3752, lon = 87.0223 } = telemetry || {};

  return (
    <div className="hud-container">
      {/* TOP STATUS BAR */}
      <div className="hud-top">
        <div className="hud-panel">
          <div className="hud-title">
            <Crosshair size={14} />
            <span>Target Acquisition</span>
          </div>
          <div className="hud-value">BONO BARI ECO RESORT</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
            Jangal Khas, Jhargram, West Bengal
          </div>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--cyan)', marginTop: '2px' }}>
            LAT: {lat.toFixed(4)}° N | LON: {lon.toFixed(4)}° E
          </div>
        </div>

        <div className="hud-panel" style={{ minWidth: '200px', textAlign: 'right' }}>
          <div className="hud-title" style={{ justifyContent: 'flex-end' }}>
            <Compass size={14} />
            <span>Telemetry Descent</span>
          </div>
          <div className="hud-value" style={{ color: 'var(--cyan)' }}>
            {altitude > 1 ? `${altitude.toLocaleString()} KM` : '120 METERS'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>
              {sector}
            </span>
            {onSkipToMap && (
              <button
                type="button"
                onClick={onSkipToMap}
                className="hud-skip-btn"
                title="Skip flight and view resort"
              >
                Fast Forward
              </button>
            )}
          </div>

          <div className="hud-progress-bar-wrap">
            <div
              className="hud-progress-bar-fill"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* CENTER RETICLE */}
      <div className="hud-center-reticle">
        <div className="hud-target-bracket tl" />
        <div className="hud-target-bracket tr" />
        <div className="hud-target-bracket bl" />
        <div className="hud-target-bracket br" />
        <div className="hud-target-cross" />
      </div>
    </div>
  );
}
