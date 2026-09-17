import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Utensils, MessageCircle, Calendar, Sparkles, Phone, Globe, Volume2, VolumeX, X } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import './CafePage.css';

const WHATSAPP_NUMBER = '917076973613'; // +91 7076973613
const VIDEO_3D_URL = 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/202606021731-e_hqa6sn.mp4';

// Authentic Bonobhoj Cafe menu items with English and Bengali translations
const MENU_ITEMS = [
  // ── Starters & Forest Bites ──
  {
    id: 'mochar-chop',
    name: 'Mochar Chop',
    nameBn: 'মোচার চপ',
    price: 120,
    desc: 'Banana-flower fritters served with tangy homemade mustard dip.',
    descBn: 'তাজা কলার মোচা, গরম মশলা ও সুস্বাদু খাঁটি কাশন্দি দিয়ে পরিবেশিত।',
    category: 'Starters & Forest Bites',
    categoryBn: 'স্টারটার ও বুনো স্ন্যাক্স',
    isVeg: true
  },
  {
    id: 'bamboo-shoot-fry',
    name: 'Bamboo-Shoot Fry',
    nameBn: 'বাঁশের কোঁড়ল ফ্রাই',
    price: 140,
    desc: 'Forest-sourced tender bamboo shoots sauteed with crushed garlic and dry red chillies.',
    descBn: 'শালবনের কচি বাঁশের কোঁড়ল, রসুন কুচি ও শুকনো লঙ্কায় ভাজা ঐতিহ্যবাহী পদ।',
    category: 'Starters & Forest Bites',
    categoryBn: 'স্টারটার ও বুনো স্ন্যাক্স',
    isVeg: true
  },
  {
    id: 'deshi-chicken-pakora',
    name: 'Deshi Chicken Pakora',
    nameBn: 'দেশি চিকেন পকোড়া',
    price: 180,
    desc: 'Free-range country chicken chunks in crunchy gram-flour and village spices.',
    descBn: 'গ্রামের মুক্তাঙ্গনের দেশি মুরগি, পুদিনা চাটনি ও শাল পাতার আবহে মচমচে ভাজা।',
    category: 'Starters & Forest Bites',
    categoryBn: 'স্টারটার ও বুনো স্ন্যাক্স',
    isVeg: false
  },
  {
    id: 'sabuj-bhorta-platter',
    name: 'Sabuj Bhorta Platter',
    nameBn: 'সবুজ ভর্তা থালা',
    price: 110,
    desc: 'Seasonal forest greens gently pounded in stone mortar with mustard oil and charred chillies.',
    descBn: 'শালবনের মৌসুমী শাক, খাঁটি সরিষার তেল, কাঁচা লঙ্কা ও পোড়া রসুনে মাখা ভর্তা।',
    category: 'Starters & Forest Bites',
    categoryBn: 'স্টারটার ও বুনো স্ন্যাক্স',
    isVeg: true
  },

  // ── Traditional Bengali Thalis ──
  {
    id: 'bonobhoj-special-thali',
    name: 'Bonobhoj Special Thali',
    nameBn: 'বনভোজ স্পেশাল থালি',
    price: 350,
    desc: 'Fragrant Govindobhog rice, sravani dal, seasonal sabzi, katla fish curry, sweet chutney & papad.',
    descBn: 'গোবিন্দভোগ চালের ভাত, সোনা মুগ ডাল, ভাজা, কাতলা মাছের কালিয়া, চাটনি ও পাঁপড়।',
    category: 'Traditional Bengali Thalis',
    categoryBn: 'ঐতিহ্যবাহী বাঙালি থালি',
    isVeg: false,
    isSignature: true
  },
  {
    id: 'deshi-murgi-thali',
    name: 'Deshi Murgi Thali',
    nameBn: 'দেশি মুরগির ঝোল থালি',
    price: 390,
    desc: 'Authentic country chicken simmered in light ginger-garlic gravy, steamed rice, dal & salad.',
    descBn: 'শালকাঠের উনুনে রান্না লাল মাটির সুবাসিত দেশি মুরগির পাতলা ঝোল ও গরম ভাত।',
    category: 'Traditional Bengali Thalis',
    categoryBn: 'ঐতিহ্যবাহী বাঙালি থালি',
    isVeg: false
  },
  {
    id: 'niramish-thali',
    name: 'Niramish Thali',
    nameBn: 'নিরামিষ ভোজ থালি',
    price: 280,
    desc: 'Five pure vegetarian seasonal preparations, ghee, bhaja, basmati rice, dal & payesh.',
    descBn: 'খাঁটি নিরামিষ পঞ্চব্যঞ্জন, গাওয়া ঘি, পোস্ত তরকারি, ডাল, চাটনি ও পায়েস।',
    category: 'Traditional Bengali Thalis',
    categoryBn: 'ঐতিহ্যবাহী বাঙালি থালি',
    isVeg: true
  },
  {
    id: 'ilish-bhaja-thali',
    name: 'Ilish Bhaja Thali',
    nameBn: 'ইলিশ ভাজা ও তেল থালি',
    price: 450,
    desc: 'Crispy fried Padma Hilsa served with steaming mustard oil rice, green chillies and dal.',
    descBn: 'মচমচে ইলিশ মাছ ভাজা, ইলিশের গরম তেল, কাঁচা লঙ্কা, ডাল ও সুগন্ধি চালের ভাত।',
    category: 'Traditional Bengali Thalis',
    categoryBn: 'ঐতিহ্যবাহী বাঙালি থালি',
    isVeg: false,
    isSpecial: true
  },

  // ── Refreshing Drinks ──
  {
    id: 'aam-panna',
    name: 'Aam Panna',
    nameBn: 'কাঁচা আমের পান্না',
    price: 80,
    desc: 'Charred raw mango cooler infused with roasted cumin, rock salt and fresh mint leaves.',
    descBn: 'পোড়া কাঁচা আমের মিষ্টি-টক শরবত, ভাজা জিরে ও পুদিনা পাতার স্নিগ্ধ রিফ্রেশার।',
    category: 'Refreshing Drinks',
    categoryBn: 'তাজা রিফ্রেশিং পানীয়',
    isVeg: true
  },
  {
    id: 'lebu-sherbet',
    name: 'Gondhoraj Lebu Sherbet',
    nameBn: 'গন্ধরাজ লেবুর শরবত',
    price: 70,
    desc: 'Aromatic Gondhoraj lime, chilled rock salt soda, and wild forest honey.',
    descBn: 'খাঁটি গন্ধরাজ লেবুর অতুলনীয় সুবাস, বিট লবণ ও শীতল জলের মনোরম শরবত।',
    category: 'Refreshing Drinks',
    categoryBn: 'তাজা রিফ্রেশিং পানীয়',
    isVeg: true
  },
  {
    id: 'tulsi-adrak-chai',
    name: 'Tulsi Adrak Chai',
    nameBn: 'তুলসী আদা মাটির ভাঁড়ের চা',
    price: 40,
    desc: 'Fresh basil leaves and crushed ginger simmered slow over firewood in terracotta cups.',
    descBn: 'তাজা তুলসী পাতা ও আদা দিয়ে শালকাঠের আঁচে ফোটানো গরম মাটির ভাঁড়ের চা।',
    category: 'Refreshing Drinks',
    categoryBn: 'তাজা রিফ্রেশিং পানীয়',
    isVeg: true
  },
  {
    id: 'matir-doi-lassi',
    name: 'Matir Doi Lassi',
    nameBn: 'মাটির হাঁড়ির দই লস্যি',
    price: 90,
    desc: 'Rich clay-pot curd blended with organic palm jaggery, cardamom and crushed pistachios.',
    descBn: 'মাটির হাঁড়ির মিষ্টি দই, নলেন গুড় ও ছোট এলাচের গুঁড়ো দিয়ে তৈরি ঘন লস্যি।',
    category: 'Refreshing Drinks',
    categoryBn: 'তাজা রিফ্রেশিং পানীয়',
    isVeg: true
  }
];

export default function CafePage({ onBackToHome, onBookNowClick, language = 'en', onToggleLanguage }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isBn = language === 'bn';

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isMuted, setIsMuted] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const videoRef = useRef(null);

  // Play video once on mount (NOT in loop)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const categories = [
    { key: 'ALL', label: isBn ? 'সকল পদ' : 'All Items' },
    { key: 'STARTERS', label: isBn ? 'স্টারটার ও স্ন্যাক্স' : 'Starters & Forest Bites', match: 'Starters & Forest Bites' },
    { key: 'THALIS', label: isBn ? 'ঐতিহ্যবাহী বাঙালি থালি' : 'Traditional Bengali Thalis', match: 'Traditional Bengali Thalis' },
    { key: 'DRINKS', label: isBn ? 'তাজা পানীয়' : 'Refreshing Drinks', match: 'Refreshing Drinks' }
  ];

  const filteredItems = activeCategory === 'ALL'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => {
        const cat = categories.find((c) => c.key === activeCategory);
        return cat && item.category === cat.match;
      });

  const handleOrderDish = (item) => {
    const itemName = isBn ? `${item.nameBn} (${item.name})` : item.name;
    const text = isBn
      ? `🌿 *বনভোজ ক্যাফে অর্ডার - বোনো বাড়ি ইকো রিসর্ট* 🌿
📍 জঙ্গল খাস, ঝাড়গ্রাম, পশ্চিমবঙ্গ

🍽️ *অর্ডার করা পদ:* ${itemName} (₹${item.price})
📋 *ক্যাটাগরি:* ${item.categoryBn}
📝 *বিবরণ:* ${item.descBn}

নমস্কার! আমি বোনো বাড়িতে আসার জন্য এই খাবারটি অগ্রিম বুক / অর্ডার করতে চাই।`
      : `🌿 *BONOBHOJ CAFE PRE-ORDER - BONO BARI ECO RESORT* 🌿
📍 Jangal Khas, Jhargram, West Bengal

🍽️ *Selected Dish:* ${item.name} (₹${item.price})
📋 *Category:* ${item.category}
📝 *Description:* ${item.desc}

Hello! I would like to pre-order this dish for my visit to Bono Bari Eco Resort.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`cafe-stage-page ${isBn ? 'font-bengali' : ''}`}>
      {/* ─── 1. FULL-BLEED 3D VIDEO (MODEL IS ON THE RIGHT, 100% UNCOVERED & VISIBLE) ─── */}
      <div className="cafe-fullscreen-video-holder">
        <video
          ref={videoRef}
          src={VIDEO_3D_URL}
          poster="/images/cafe_host_poster.jpg"
          autoPlay
          muted={isMuted}
          playsInline
          // NO loop! Plays exactly once and holds last frame
          className="cafe-stage-video"
          title="3D Forest Host"
        />
        {/* Scrim strictly covers the LEFT side for text contrast, leaving the RIGHT side (3D Model) completely clear! */}
        <div className="cafe-stage-left-scrim" />
      </div>

      {/* ─── 2. TOP STICKY NAVBAR ────────────────────────────────────────── */}
      <nav className="cafe-stage-navbar">
        <button type="button" className="cafe-back-btn" onClick={onBackToHome}>
          <ArrowLeft size={16} />
          <span>{t.cafeBackBtn}</span>
        </button>

        <span className="cafe-stage-brand">{t.cafeBrand}</span>

        <div className="cafe-stage-nav-actions">
          {/* Sound Toggle */}
          <button
            type="button"
            className="cafe-sound-toggle-btn"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'সাউন্ড চালু করুন' : 'সাউন্ড বন্ধ করুন'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isMuted ? (isBn ? 'সাউন্ড চালু' : 'Unmute') : (isBn ? 'সাউন্ড বন্ধ' : 'Muted')}</span>
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            className="cafe-lang-toggle-btn"
            onClick={onToggleLanguage}
            title={isBn ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
          >
            <Globe size={14} />
            <span>{isBn ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Book Table Button */}
          <button
            type="button"
            className="cafe-navbar-reserve-btn"
            onClick={() => onBookNowClick && onBookNowClick(isBn ? 'বনভোজ স্পেশাল টেবিল' : 'Bonobhoj Feast Table')}
          >
            <Calendar size={14} />
            <span>{t.cafeBookTable}</span>
          </button>
        </div>
      </nav>

      {/* ─── MOBILE VERTICAL SIDEBAR COLUMN: 3D MODEL HAND POINTS DIRECTLY AT THIS ─── */}
      <div className={`cafe-mobile-sidebar-col ${isMobileMenuOpen ? 'is-hidden' : ''}`}>
        <div className="cafe-col-header">
          <span className="cafe-col-badge">
            <Sparkles size={11} />
            {isBn ? 'বনভোজ ক্যাফে' : 'Bonobhoj Cafe'}
          </span>
          <span className="cafe-col-sub">
            {isBn ? 'শেফের খাঁটি পদ' : 'Chef’s Selection'}
          </span>
        </div>

        {/* Quick Category Jump Buttons in Column */}
        <div className="cafe-col-cat-list">
          {categories.slice(1).map((cat) => (
            <button
              key={cat.key}
              type="button"
              className="cafe-col-cat-btn"
              onClick={() => {
                setActiveCategory(cat.key);
                setIsMobileMenuOpen(true);
              }}
            >
              <span className="cafe-col-cat-dot" />
              <span>{cat.label}</span>
              <span className="cafe-col-cat-arr">→</span>
            </button>
          ))}
        </div>

        {/* Explore Full Menu & Price List CTA */}
        <button
          type="button"
          className="cafe-col-explore-btn"
          onClick={() => {
            setActiveCategory('ALL');
            setIsMobileMenuOpen(true);
          }}
        >
          <Utensils size={13} />
          <span>{isBn ? 'মূল্য তালিকা দেখুন' : 'Explore Price List'}</span>
        </button>

        {/* Direct WhatsApp Pre-order */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            isBn ? 'নমস্কার! বনভোজ ক্যাফেতে টেবিল বুকিং ও খাবারের অর্ডার জানতে চাই।' : 'Hello! I would like to inquire about Bonobhoj Cafe table booking and menu.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cafe-col-wa-btn"
          title="WhatsApp"
        >
          <MessageCircle size={13} />
          <span>{isBn ? 'হোয়াটসঅ্যাপ অর্ডার' : 'WhatsApp Order'}</span>
        </a>

        {/* Pulse Beacon pointing from Model's hand */}
        <div className="cafe-col-pointer-glow">
          <span className="cafe-pointer-pulse-dot" />
        </div>
      </div>

      {/* ─── 3. MAIN WORKSPACE: MENU SCROLLS ON LEFT, 3D MODEL IS FIXED ON RIGHT ─── */}
      <div className="cafe-stage-body">
        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="cafe-mobile-drawer-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* LEFT COLUMN: ON DESKTOP SCROLLS ON LEFT; ON MOBILE SLIDES UP AS DEDICATED SEPARATE VIEW */}
        <aside className={`cafe-scrollable-menu-panel ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {/* Mobile-only Close Header */}
          <div className="cafe-mobile-drawer-header">
            <div className="cafe-mobile-drawer-title">
              <Utensils size={14} />
              <span>{isBn ? 'মেনু ও মূল্য তালিকা' : 'Menu & Price List'}</span>
            </div>
            <button
              type="button"
              className="cafe-mobile-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={15} />
              <span>{isBn ? 'ভিডিওতে ফিরুন' : 'Back to Video'}</span>
            </button>
          </div>

          {/* Header */}
          <div className="cafe-panel-header">
            <div className="cafe-panel-badge">
              <Utensils size={13} />
              <span>{t.cafeBadge}</span>
            </div>

            <h1 className="cafe-panel-title">
              {t.cafeBrand}
            </h1>

            <p className="cafe-panel-desc">
              {t.cafeTagline}
            </p>

            <div className="cafe-panel-actions">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  isBn ? 'নমস্কার! বনভোজ ক্যাফের মেনু ও টেবিল বুকিং জানতে চাই।' : 'Hello! I would like to inquire about Bonobhoj Cafe table booking & menu.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cafe-panel-wa-btn"
              >
                <MessageCircle size={15} />
                <span>{t.cafeHotline}<strong>+91 7076973613</strong></span>
              </a>
            </div>

            {/* Category Filter Tabs */}
            <div className="cafe-filter-tabs">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`cafe-filter-pill ${activeCategory === cat.key ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Dish Cards Container */}
          <div className="cafe-cards-scroll-track">
            <div className="cafe-dish-cards-list">
              {filteredItems.map((item) => {
                const displayName = isBn ? item.nameBn : item.name;
                const displayDesc = isBn ? item.descBn : item.desc;
                const displayCat  = isBn ? item.categoryBn : item.category;

                return (
                  <div key={item.id} className="cafe-glass-dish-card">
                    {/* Top row */}
                    <div className="cafe-dish-top">
                      <div className="cafe-dish-cat-wrap">
                        <span className={`cafe-dish-dot ${item.isVeg ? 'is-veg' : 'is-nonveg'}`} />
                        <span className="cafe-dish-category">{displayCat}</span>
                      </div>

                      {item.isSignature && (
                        <span className="cafe-dish-special-pill">
                          <Sparkles size={11} /> {isBn ? 'সিগনেচার ডিশ' : 'Signature'}
                        </span>
                      )}
                      {item.isSpecial && (
                        <span className="cafe-dish-special-pill is-hilsa">
                          ★ {isBn ? 'সিজনাল স্পেশাল' : 'Seasonal Special'}
                        </span>
                      )}
                    </div>

                    {/* Title & Price */}
                    <div className="cafe-dish-header">
                      <h3 className="cafe-dish-name">
                        {displayName}
                      </h3>
                      <span className="cafe-dish-price">
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="cafe-dish-desc">
                      {displayDesc}
                    </p>

                    {/* Order Button via WhatsApp */}
                    <div className="cafe-dish-bottom">
                      <button
                        type="button"
                        className="cafe-dish-order-btn"
                        onClick={() => handleOrderDish(item)}
                        title={isBn ? 'এই খাবারটি হোয়াটসঅ্যাপে অর্ডার করুন' : 'Pre-order this dish on WhatsApp'}
                      >
                        <MessageCircle size={14} />
                        <span>{t.cafeOrderViaWa}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dining info footer inside the scrollable panel */}
            <div className="cafe-panel-footer-card">
              <h3 className="cafe-footer-title">
                {isBn ? 'শালবনের মাঝে আহারের খাঁটি আনন্দ' : 'Forest Dining by the Sal Trees'}
              </h3>
              <p className="cafe-footer-text">
                {isBn
                  ? 'বনভোজ ক্যাফেতে রান্নার সব্জি ও তেল স্থানীয় চাষীদের থেকে সংগৃহীত। শান্ত পরিবেশে পরিবার পরিজন নিয়ে লাল মাটির ঐতিহ্যবাহী খাবার উপভোগ করার এক আদর্শ স্থান।'
                  : 'All produce at Bonobhoj is sourced from native village patches and prepared fresh over slow firewood. Reserve in advance for day feasts or evening bonfires.'}
              </p>
              <button
                type="button"
                className="cafe-footer-reserve-btn"
                onClick={() => onBookNowClick && onBookNowClick(isBn ? 'বনভোজ ডে-ভিজিট ফিস্ট' : 'Bonobhoj Day Visit Feast')}
              >
                {t.cafeBookTable} (+91 7076973613)
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT AREA: COMPLETELY CLEAR SO THE 3D MODEL IS UNCOVERED & VISIBLE */}
        <div className="cafe-model-view-area">
          <div className="cafe-model-tag-pill">
            <Sparkles size={13} className="cafe-sparkle-gold" />
            <span>{t.cafeChefBadge}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
