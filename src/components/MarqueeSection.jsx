import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import './MarqueeSection.css';

// 21 Authentic Bono Bari photos from public/photo-galary
const PHOTO_GALLERY_IMAGES = [
  '/photo-galary/2019040916-1024x614.jpg',
  '/photo-galary/2019073151-1024x768.jpg',
  '/photo-galary/2021092555-1024x623.jpg',
  '/photo-galary/2021092559-1024x616.jpg',
  '/photo-galary/2021092579-1024x642.jpg',
  '/photo-galary/2021092596-1024x683.jpg',
  '/photo-galary/2021092617-1024x683.jpg',
  '/photo-galary/2021092631-1-1005x1024.jpg',
  '/photo-galary/2021092636-1024x683.jpg',
  '/photo-galary/2021092643-1024x683.jpg',
  '/photo-galary/2021092653-1024x576.jpg',
  '/photo-galary/2021092668-1024x683.jpg',
  '/photo-galary/2021092681-768x1024.jpg',
  '/photo-galary/2021092682-1-1024x683.jpg',
  '/photo-galary/2021092685.jpg',
  '/photo-galary/2021092690-1-1024x768.jpg',
  '/photo-galary/2021092695-1-1024x512.jpg',
  '/photo-galary/2021092695-2-1024x768.jpg',
  '/photo-galary/2021092695-683x1024.jpg',
  '/photo-galary/2021092696-1024x683.jpg',
  '/photo-galary/2021092698-1024x683.jpg'
];

// ─── 3-ROW SPLIT (7 PHOTOS EACH, DUPLICATED FOR SEAMLESS 50% LOOP) ───
// Row 1: Photos 0 to 6
const ROW_1_BASE = PHOTO_GALLERY_IMAGES.slice(0, 7);
const ROW_1 = [...ROW_1_BASE, ...ROW_1_BASE];

// Row 2: Photos 7 to 13
const ROW_2_BASE = PHOTO_GALLERY_IMAGES.slice(7, 14);
const ROW_2 = [...ROW_2_BASE, ...ROW_2_BASE];

// Row 3: Photos 14 to 20
const ROW_3_BASE = PHOTO_GALLERY_IMAGES.slice(14, 21);
const ROW_3 = [...ROW_3_BASE, ...ROW_3_BASE];

export default function MarqueeSection({ language = 'en' }) {
  const isBn = language === 'bn';
  const sectionRef = useRef(null);

  // Popup lightbox state
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  // Keyboard navigation for lightbox
  const handleNextPhoto = useCallback(() => {
    setSelectedPhotoIndex((prev) =>
      prev === null ? null : (prev + 1) % PHOTO_GALLERY_IMAGES.length
    );
  }, []);

  const handlePrevPhoto = useCallback(() => {
    setSelectedPhotoIndex((prev) =>
      prev === null
        ? null
        : (prev - 1 + PHOTO_GALLERY_IMAGES.length) % PHOTO_GALLERY_IMAGES.length
    );
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  useEffect(() => {
    if (selectedPhotoIndex === null) {
      document.body.classList.remove('gallery-modal-open');
      return;
    }

    document.body.classList.add('gallery-modal-open');
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseModal();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('gallery-modal-open');
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedPhotoIndex, handleCloseModal, handleNextPhoto, handlePrevPhoto]);

  return (
    <section className={`marquee-section ${isBn ? 'font-bengali' : ''}`} ref={sectionRef}>
      <div className="marquee-rows-container">
        {/* Row 1: Smooth continuous drift left */}
        <div className="marquee-row marquee-row-drift-left">
          {ROW_1.map((url, i) => {
            const originalIndex = i % 7;
            return (
              <div
                key={`row1-${i}`}
                className="marquee-tile-wrapper"
                onClick={() => setSelectedPhotoIndex(originalIndex)}
                title={isBn ? 'ছবিটি বড় করে দেখতে ক্লিক করুন' : 'Click to view photo in full popup'}
              >
                <img
                  src={url}
                  alt="Bono Bari Resort Gallery"
                  loading="lazy"
                  className="marquee-tile"
                />
                <div className="marquee-tile-overlay">
                  <Maximize2 size={20} className="marquee-tile-zoom-icon" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2: Smooth continuous drift right */}
        <div className="marquee-row marquee-row-drift-right">
          {ROW_2.map((url, i) => {
            const originalIndex = 7 + (i % 7);
            return (
              <div
                key={`row2-${i}`}
                className="marquee-tile-wrapper"
                onClick={() => setSelectedPhotoIndex(originalIndex)}
                title={isBn ? 'ছবিটি বড় করে দেখতে ক্লিক করুন' : 'Click to view photo in full popup'}
              >
                <img
                  src={url}
                  alt="Bono Bari Resort Gallery"
                  loading="lazy"
                  className="marquee-tile"
                />
                <div className="marquee-tile-overlay">
                  <Maximize2 size={20} className="marquee-tile-zoom-icon" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 3: Smooth continuous drift left (alternate speed) */}
        <div className="marquee-row marquee-row-drift-left-alt">
          {ROW_3.map((url, i) => {
            const originalIndex = 14 + (i % 7);
            return (
              <div
                key={`row3-${i}`}
                className="marquee-tile-wrapper"
                onClick={() => setSelectedPhotoIndex(originalIndex)}
                title={isBn ? 'ছবিটি বড় করে দেখতে ক্লিক করুন' : 'Click to view photo in full popup'}
              >
                <img
                  src={url}
                  alt="Bono Bari Resort Gallery"
                  loading="lazy"
                  className="marquee-tile"
                />
                <div className="marquee-tile-overlay">
                  <Maximize2 size={20} className="marquee-tile-zoom-icon" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── FULLSCREEN POPUP LIGHTBOX MODAL VIEW (RENDERED TO BODY) ─── */}
      {selectedPhotoIndex !== null && typeof document !== 'undefined' && createPortal(
        <div className="marquee-modal-backdrop" onClick={handleCloseModal}>
          <div className="marquee-modal-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Top Toolbar */}
            <div className="marquee-modal-topbar">
              <span className="marquee-modal-badge">
                🌿 {isBn ? 'বোনো বাড়ি ফটো গ্যালারি • ঝাড়গ্রাম' : 'Bono Bari Eco Resort Gallery • Jhargram'}
              </span>

              <div className="marquee-modal-top-right">
                <span className="marquee-modal-counter">
                  {selectedPhotoIndex + 1} / {PHOTO_GALLERY_IMAGES.length}
                </span>
                <button
                  type="button"
                  className="marquee-modal-close-btn"
                  onClick={handleCloseModal}
                  title={isBn ? 'বন্ধ করুন (Esc)' : 'Close (Esc)'}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Photo Viewport with Prev/Next Navigation */}
            <div className="marquee-modal-viewport">
              <button
                type="button"
                className="marquee-modal-nav-btn is-prev"
                onClick={handlePrevPhoto}
                title={isBn ? 'আগের ছবি (←)' : 'Previous photo (←)'}
              >
                <ChevronLeft size={28} />
              </button>

              <div className="marquee-modal-image-container">
                <img
                  src={PHOTO_GALLERY_IMAGES[selectedPhotoIndex]}
                  alt="Bono Bari Eco Resort Gallery Large View"
                  className="marquee-modal-image"
                />
              </div>

              <button
                type="button"
                className="marquee-modal-nav-btn is-next"
                onClick={handleNextPhoto}
                title={isBn ? 'পরবর্তী ছবি (→)' : 'Next photo (→)'}
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
