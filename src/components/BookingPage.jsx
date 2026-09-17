import React, { useState } from 'react';
import { ArrowLeft, Globe, MessageCircle, Phone, Calendar, Sparkles } from 'lucide-react';
import PricingSection, { plans } from './PricingSection';
import { TRANSLATIONS } from '../translations';
import './BookingPage.css';

const WHATSAPP_NUMBER = '917076973613'; // +91 7076973613

export default function BookingPage({ onBackToHome, onOpenBookingModal, language = 'en', onToggleLanguage }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isBn = language === 'bn';

  return (
    <div className={`booking-page-root ${isBn ? 'font-bengali' : ''}`}>
      {/* ─── 1. TOP NAVBAR ──────────────────────────────────────────────── */}
      <header className="booking-navbar">
        <div className="booking-navbar-inner">
          <button
            type="button"
            className="booking-back-btn"
            onClick={onBackToHome}
            title={isBn ? 'হোম পেজে ফিরে যান' : 'Back to Home'}
            aria-label="Back to Home"
          >
            <ArrowLeft size={18} className="booking-back-arrow" />
            <span className="booking-back-label-desktop">{isBn ? 'মূল পাতায় ফিরুন' : 'Back to Home'}</span>
            <span className="booking-back-label-mobile">{isBn ? 'মূল পাতায়' : 'Back'}</span>
          </button>

          <div className="booking-nav-brand">
            <span className="booking-brand-title">
              {isBn ? 'বোনো বাড়ি • বুকিং ও প্রাইসিং' : 'BONO BARI • RESERVATION & PRICING'}
            </span>
          </div>

          <div className="booking-nav-actions">
            {/* Language Switcher */}
            <button
              type="button"
              className="booking-lang-btn"
              onClick={onToggleLanguage}
              title={isBn ? 'Switch to English' : 'বাংলায় দেখুন'}
            >
              <Globe size={14} />
              <span className="booking-lang-label-desktop">{isBn ? 'English' : 'বাংলা'}</span>
              <span className="booking-lang-label-mobile">{isBn ? 'EN' : 'বাং'}</span>
            </button>

            {/* Direct WhatsApp Call/Chat */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                isBn
                  ? 'নমস্কার! আমি বোনো বাড়ি ইকো রিসর্টে বুকিং ও প্ল্যান সম্পর্কে জানতে চাই।'
                  : 'Hello! I would like to inquire about booking and plans at Bono Bari Eco Resort.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="booking-wa-pill-btn"
              title="WhatsApp"
            >
              <MessageCircle size={14} />
              <span className="booking-wa-label-desktop">+91 7076973613</span>
              <span className="booking-wa-label-mobile">{isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── 2. HERO BANNER FOR BOOKING PAGE ─────────────────────────────── */}
      <div className="booking-hero-intro">
        <div className="booking-hero-badge">
          <Sparkles size={13} className="text-yellow-400" />
          <span>{isBn ? 'অফিসিয়াল রিজার্ভেশন পোর্টাল' : 'Official Reservation Portal'}</span>
        </div>
        <h1 className="booking-hero-heading">
          {isBn ? 'আপনার পছন্দের প্ল্যান ও রুম বেছে নিন' : 'Choose Your Ideal Plan & Stay'}
        </h1>
        <p className="booking-hero-sub">
          {isBn
            ? 'ঝাড়গ্রামের শালবনের কোলে নির্জন প্রাকৃতিক সৌন্দর্য, গ্রামীণ ঐতিহ্য ও বিশেষ প্ল্যানের সম্পূর্ণ বিবরণ।'
            : 'Explore clear pricing tiers, lifetime access plans, and direct forest retreat reservations at Jhargram.'}
        </p>
      </div>

      {/* ─── 3. EXACT PRICING SECTION COMPONENT (BONO BARI ECO RESORT) ─── */}
      <PricingSection
        language={language}
        onSelectPlan={(plan) => onOpenBookingModal && onOpenBookingModal(plan.name)}
      />

      {/* ─── 4. DIRECT RESORT WHATSAPP RESERVATION BANNER ────────────────── */}
      <div className="booking-resort-banner-wrap">
        <div className="booking-resort-banner-card">
          <div className="booking-resort-left">
            <div className="booking-resort-tag">
              <Calendar size={14} />
              <span>{isBn ? 'রিসর্ট রুম ও কটেজ বুকিং' : 'Resort Room & Cottage Stays'}</span>
            </div>
            <h2 className="booking-resort-title">
              {isBn ? 'শাল ফরেস্ট কটেজ ও ডে-ভিজিট ফিস্ট' : 'Looking to book a Cottage or Day Visit?'}
            </h2>
            <p className="booking-resort-desc">
              {isBn
                ? 'সরাসরি রিসর্ট ম্যানেজারদের সাথে কথা বলে বা হোয়াটসঅ্যাপের মাধ্যমে আপনার সুবিধাজনক তারিখ নিশ্চিত করুন।'
                : 'Directly speak with our resort hosts or reserve instantly via WhatsApp with your preferred check-in dates.'}
            </p>
          </div>

          <div className="booking-resort-actions">
            <button
              type="button"
              className="booking-resort-btn-primary"
              onClick={() => onOpenBookingModal && onOpenBookingModal('Sal Forest Retreat Villa')}
            >
              <Calendar size={15} />
              <span>{isBn ? 'বুকিং ফর্ম পূরণ করুন' : 'Instant Booking Form'}</span>
            </button>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                isBn
                  ? 'নমস্কার! আমি বোনো বাড়ি ইকো রিসর্টে থাকার জন্য কটেজ বুক করতে চাই।'
                  : 'Hello! I would like to book a cottage stay at Bono Bari Eco Resort Jhargram.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="booking-resort-btn-wa"
            >
              <MessageCircle size={15} />
              <span>WhatsApp (+91 7076973613)</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── 5. BOTTOM RETURN TO MAIN HOME PAGE BUTTON ─────────────────── */}
      <div className="booking-bottom-return-wrap">
        <button
          type="button"
          className="booking-bottom-home-btn"
          onClick={onBackToHome}
          title={isBn ? 'হোম পেজে ফিরে যান' : 'Return to Home Page'}
        >
          <ArrowLeft size={16} />
          <span>{isBn ? 'মূল ওয়েবসাইটে ফিরে যান' : 'Return to Home Page'}</span>
        </button>
      </div>
    </div>
  );
}
