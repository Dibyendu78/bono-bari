import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn, LiveProjectButton } from './SharedComponents';
import { TRANSLATIONS } from '../translations';
import './ProjectsSection.css';

// Authentic Bono Bari resort images from the bono-bari folder
const RETREATS_DATA = [
  {
    num: '01',
    category: 'Villas & Cottages',
    categoryBn: 'ভিলা ও কটেজ',
    name: 'Sal Forest Retreat',
    nameBn: 'শাল ফরেস্ট রিট্রিট',
    col1img1: '/bono-bari/photo_2026-09-17_10-31-34.jpg',
    col1img2: '/bono-bari/photo_2026-09-17_10-33-00.jpg',
    col2img: '/bono-bari/photo_2026-09-17_10-33-04.jpg'
  },
  {
    num: '02',
    category: 'Nature & Trails',
    categoryBn: 'প্রকৃতি ও ট্রেইল',
    name: 'Jhargram Woodlands',
    nameBn: 'ঝাড়গ্রাম উডল্যান্ডস',
    col1img1: '/bono-bari/photo_2026-09-17_10-33-08.jpg',
    col1img2: '/bono-bari/photo_2026-09-17_10-34-02.jpg',
    col2img: '/bono-bari/photo_2026-09-17_10-34-06.jpg'
  },
  {
    num: '03',
    category: 'Eco Architecture',
    categoryBn: 'মাটির স্থাপত্য',
    name: 'Rustic Mud & Terracotta',
    nameBn: 'রুস্টিক মাটির কটেজ',
    col1img1: '/bono-bari/photo_2026-09-17_10-34-10.jpg',
    col1img2: '/bono-bari/photo_2026-09-17_10-34-13.jpg',
    col2img: '/bono-bari/photo_2026-09-17_10-34-17.jpg'
  },
  {
    num: '04',
    category: 'Sanctuary',
    categoryBn: 'নিভৃতবাস',
    name: 'Canopy Green Haven',
    nameBn: 'ক্যানোপি গ্রিন হ্যাভেন',
    col1img1: '/bono-bari/photo_2026-09-17_10-34-22.jpg',
    col1img2: '/bono-bari/photo_2026-09-17_10-34-25.jpg',
    col2img: '/bono-bari/photo_2026-09-17_10-34-32.jpg'
  },
  {
    num: '05',
    category: 'Hospitality',
    categoryBn: 'আতিথেয়তা',
    name: 'Fireside Serenity',
    nameBn: 'ক্যাম্পফায়ার ও আড্ডা ভিলা',
    col1img1: '/bono-bari/photo_2026-09-17_10-34-36.jpg',
    col1img2: '/bono-bari/photo_2026-09-17_10-34-45.jpg',
    col2img: '/bono-bari/photo_2026-09-17_10-34-49.jpg'
  }
];

const TOTAL_CARDS = RETREATS_DATA.length;

function StickyProjectCard({ project, index, totalCards, onBookNowClick, isBn, reserveBtnLabel }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start']
  });

  // Scale down as cards stack on top of each other
  const targetScale = 1 - (totalCards - 1 - index) * 0.025;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  const displayName = isBn ? project.nameBn : project.name;
  const displayCategory = isBn ? project.categoryBn : project.category;

  return (
    <div
      ref={containerRef}
      className="project-card-outer"
      style={{
        top: `calc(var(--card-base-top, 88px) + ${index} * var(--card-step, 24px))`
      }}
    >
      <motion.div
        className="project-card-box"
        style={{ scale }}
      >
        {/* Top row */}
        <div className="project-card-top">
          <span className="project-card-num">{project.num}</span>
          <div className="project-card-meta">
            <span className="project-card-category">{displayCategory}</span>
            <h3 className="project-card-name">{displayName}</h3>
          </div>
          <LiveProjectButton
            label={reserveBtnLabel}
            onClick={() => onBookNowClick && onBookNowClick(displayName)}
          />
        </div>

        {/* Bottom image grid */}
        <div className="project-card-grid">
          {/* Left column (40% width) */}
          <div className="project-col-left">
            <img
              src={project.col1img1}
              alt={`${displayName} photo 1`}
              loading="lazy"
              className="project-img project-img-left-top"
            />
            <img
              src={project.col1img2}
              alt={`${displayName} photo 2`}
              loading="lazy"
              className="project-img project-img-left-bottom"
            />
          </div>

          {/* Right column (60% width) */}
          <div className="project-col-right">
            <img
              src={project.col2img}
              alt={`${displayName} photo 3`}
              loading="lazy"
              className="project-img project-img-right-tall"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection({ onBookNowClick, language = 'en' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isBn = language === 'bn';

  return (
    <section className={`projects-section ${isBn ? 'font-bengali' : ''}`} id="projects">
      {/* Heading: "Forest Retreats" using .hero-heading gradient */}
      <FadeIn delay={0} y={40}>
        <div className="projects-header-wrap">
          <h2 className="hero-heading projects-heading">
            {t.staysHeading}
          </h2>
          <p className="projects-subheading">
            {t.staysSubheading}
          </p>
        </div>
      </FadeIn>

      {/* Sticky Stacking Cards */}
      <div className="projects-stack-container">
        {RETREATS_DATA.map((project, i) => (
          <StickyProjectCard
            key={project.num}
            project={project}
            index={i}
            totalCards={TOTAL_CARDS}
            onBookNowClick={onBookNowClick}
            isBn={isBn}
            reserveBtnLabel={t.staysReserveBtn}
          />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="projects-footer" id="contact">
        <FadeIn delay={0.1} y={20}>
          <p className="projects-footer-loc">
            {t.footerLoc}
          </p>
        </FadeIn>
        <FadeIn delay={0.2} y={30}>
          <h3 className="hero-heading projects-footer-title" style={{ whiteSpace: 'pre-line' }}>
            {t.footerTitle}
          </h3>
        </FadeIn>
        <FadeIn delay={0.25} y={20}>
          <p className="projects-footer-desc">
            {t.footerDesc}
          </p>
        </FadeIn>
        <FadeIn delay={0.3} y={20}>
          <div className="projects-footer-actions">
            <button
              type="button"
              className="projects-footer-book-btn"
              onClick={() => onBookNowClick && onBookNowClick(isBn ? 'শাল ফরেস্ট ভিলা স্টে' : 'Sal Forest Retreat Villa')}
            >
              {t.footerBookBtn}
            </button>
            <a
              href={`https://wa.me/917076973613?text=${encodeURIComponent(
                isBn ? 'নমস্কার! আমি বোনো বাড়ি ইকো রিসর্টে বুকিং সম্পর্কে জানতে চাই।' : 'Hello! I would like to book a stay at Bono Bari Eco Resort.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="projects-footer-wa-btn"
            >
              {t.footerWaBtn}
            </a>
          </div>
        </FadeIn>
        <FadeIn delay={0.35} y={20}>
          <a href="mailto:bonobari@gmail.com" className="projects-footer-email">
            bonobari@gmail.com
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
