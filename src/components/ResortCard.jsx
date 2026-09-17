import React from 'react';
import { MapPin, ExternalLink, RotateCcw, TreePine, Compass, Navigation2 } from 'lucide-react';
import './ResortCard.css';

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/oFT8EjXe96c2LYRC6?g_st=ac';

export default function ResortCard({ onReturnToOrbit, onReturnToHome, language = 'en' }) {
  const isBn = language === 'bn';

  return (
    <div className={`resort-card ${isBn ? 'font-bengali' : ''}`}>
      <div className="resort-header">
        <div>
          <h2 className="resort-name">
            {isBn ? 'বোনো বাড়ি ইকো রিসর্ট' : 'Bono Bari Eco Resort'}
          </h2>
          <div className="resort-location">
            <MapPin size={16} />
            <span>
              {isBn
                ? 'জঙ্গল খাস, ঝাড়গ্রাম, পশ্চিমবঙ্গ ৭২১৫১৪'
                : 'Jangal Khas, Jhargram, West Bengal 721514'}
            </span>
          </div>
        </div>
        <span className="resort-badge">
          {isBn ? 'উপস্থিত' : 'Arrived'}
        </span>
      </div>

      <div className="resort-grid">
        <div className="resort-stat">
          <span className="resort-stat-label">
            {isBn ? 'অঞ্চল' : 'Forest Region'}
          </span>
          <span className="resort-stat-val">
            {isBn ? 'জঙ্গল খাস / কালাবনি' : 'Jangal Khas / Kalaboni'}
          </span>
        </div>
        <div className="resort-stat">
          <span className="resort-stat-label">
            {isBn ? 'স্থানাঙ্ক' : 'Coordinates'}
          </span>
          <span className="resort-stat-val">22.3752° N, 87.0223° E</span>
        </div>
        <div className="resort-stat">
          <span className="resort-stat-label">
            {isBn ? 'কলকাতা থেকে' : 'From Kolkata'}
          </span>
          <span className="resort-stat-val">
            {isBn ? '~১৭০ কিমি (NH16)' : '~170 km (via NH16)'}
          </span>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5', marginBottom: '18px' }}>
        {isBn
          ? 'ঝাড়গ্রামের লাল মাটির শাল ও মহুয়া বনের গভীরে অবস্থিত। দূষণহীন নির্মল প্রকৃতি, রাত্রিকালীন তারা দর্শন ও গ্রামীণ আতিথেয়তার এক অনন্য মিলনক্ষেত্র।'
          : 'Tucked deep within the serene red-soil Sal & Mahua groves of Jhargram. Experience raw, unpolluted nature, nocturnal stargazing, and eco-friendly village hospitality.'}
      </p>

      <div className="resort-actions">
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gmaps"
        >
          <ExternalLink size={16} />
          <span>{isBn ? 'গুগল ম্যাপে দেখুন' : 'Open in Google Maps'}</span>
        </a>

        <button
          type="button"
          onClick={onReturnToHome || onReturnToOrbit}
          className="btn-orbit-return"
          title={isBn ? 'মূল পাতায় ফিরে যান' : 'Return to Home Page'}
        >
          <RotateCcw size={15} />
          <span>{isBn ? 'মূল পাতায় ফিরুন' : 'Return to Home Page'}</span>
        </button>
      </div>
    </div>
  );
}
