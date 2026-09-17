import React, { useState, useEffect, useRef } from 'react';
import { Star, X, CheckCircle2, ChevronRight, ChevronLeft, MessageSquareQuote, Minimize2, Maximize2 } from 'lucide-react';
import './LiveReviews.css';

// Authentic Bengali guest reviews for Bono Bari Eco Resort
const BENGALI_REVIEWS = [
  {
    id: 1,
    name: 'সুব্রত মুখার্জি',
    city: 'কলকাতা',
    stay: 'শাল ভিলা স্টে',
    rating: 5,
    text: 'ঝাড়গ্রামের শাল জঙ্গলের মাঝে এমন শান্ত ও মনোরম রিসর্ট সত্যিই অসাধারণ! বনভোজ ক্যাফের দেশি মুরগির থালি আর শাল পাতার সুবাস মন ছুঁয়ে গেছে।',
    time: '২ ঘন্টা আগে',
    initial: 'সু'
  },
  {
    id: 2,
    name: 'অনন্যা সেনগুপ্ত',
    city: 'হাওড়া',
    stay: 'মাটির ফ্যামিলি কটেজ',
    rating: 5,
    text: 'বোনো বাড়িতে উইকএন্ডটা অপূর্ব কাটল। লাল মাটির পথের মিষ্টি গন্ধ, ছিমছাম কটেজ আর রাতের ক্যাম্পফায়ার আমাদের সবার মন ভরিয়ে দিয়েছে।',
    time: '৪ ঘন্টা আগে',
    initial: 'অ'
  },
  {
    id: 3,
    name: 'দেবমাল্য ব্যানার্জি',
    city: 'মেদিনীপুর',
    stay: 'উইকএন্ড ফরেস্ট রিট্রিট',
    rating: 5,
    text: 'শহরের কোলাহল ছেড়ে প্রকৃতির কোলে সময় কাটানোর সেরা ঠিকানা। এখানকার স্টাফদের ব্যবহার অত্যন্ত অমায়িক ও আন্তরিক। ঝাড়গ্রামে এলে এখানেই উঠবেন!',
    time: 'গতকাল',
    initial: 'দে'
  },
  {
    id: 4,
    name: 'প্রিয়াঙ্কা দাস',
    city: 'বর্ধমান',
    stay: 'ডে ভিজিট ও বনভোজ ভোজ',
    rating: 5,
    text: 'সকালে ঘুম ভাঙল নানা রকম পাখির মিষ্টি ডাকে। শালবনের কটেজ আর খাঁটি বাঙালি খাবারের স্বাদ মুখে লেগে থাকার মতো। ৫ তারারও বেশি দেওয়ার ইচ্ছে ছিল!',
    time: '১ দিন আগে',
    initial: 'প্রি'
  },
  {
    id: 5,
    name: 'সৌভিক রায়',
    city: 'সল্টলেক, কলকাতা',
    stay: 'ক্যানোপি গ্রিন হ্যাভেন',
    rating: 5,
    text: 'পরিবার ও বাচ্চাদের নিয়ে ঘুরে এলাম। জঙ্গল সাফারি ট্রেইল দারুণ লেগেছে। খাঁটি গ্রামীণ বাংলার আতিথেয়তা আর আধুনিক আরাম একসাথে!',
    time: '২ দিন আগে',
    initial: 'সৌ'
  },
  {
    id: 6,
    name: 'কৌশিক মণ্ডল',
    city: 'দুর্গাপুর',
    stay: 'রুস্টিক আর্কিটেকচার ভিলা',
    rating: 5,
    text: 'শালবনের হাওয়ায় প্রাণ জুড়িয়ে গেল। বনভোজ ক্যাফের কচি পাঁঠার ঝোল আর গরম ভাত লা-জবাব! বোনো বাড়ির এমন অভিজ্ঞতা বারবার পেতে চাই।',
    time: '৩ দিন আগে',
    initial: 'কৌ'
  }
];

const ROTATION_INTERVAL_MS = 6500; // 6.5s per review

export default function LiveReviews({ onBookNowClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [progress, setProgress] = useState(0);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (isClosed || isMinimized) return;

    const stepMs = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      if (isHoveredRef.current) return; // Pause on hover

      elapsed += stepMs;
      setProgress((elapsed / ROTATION_INTERVAL_MS) * 100);

      if (elapsed >= ROTATION_INTERVAL_MS) {
        elapsed = 0;
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % BENGALI_REVIEWS.length);
      }
    }, stepMs);

    return () => clearInterval(interval);
  }, [isClosed, isMinimized, currentIndex]);

  if (isClosed) return null;

  const current = BENGALI_REVIEWS[currentIndex];

  const handleNext = (e) => {
    e.stopPropagation();
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % BENGALI_REVIEWS.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + BENGALI_REVIEWS.length) % BENGALI_REVIEWS.length);
  };

  // Minimized Floating Pill View
  if (isMinimized) {
    return (
      <div className="live-reviews-minimized">
        <button
          type="button"
          className="live-review-pill-btn"
          onClick={() => setIsMinimized(false)}
          title="রিভিউ সম্পূর্ণ দেখুন (Click to Expand)"
        >
          <span className="live-review-pulse-dot" />
          <Star size={13} fill="#facc15" color="#facc15" />
          <span className="live-review-pill-score">৫.০</span>
          <span className="live-review-pill-text">লাইভ গেস্ট রিভিউ ({current.name})</span>
          <Maximize2 size={13} className="live-review-expand-icon" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="live-reviews-container"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
    >
      <div
        className="live-review-card"
        onClick={() => onBookNowClick && onBookNowClick(current.stay)}
        title="বুক করতে ক্লিক করুন (Click to Book this Retreat)"
      >
        {/* Top Header Row */}
        <div className="live-review-header">
          <div className="live-review-tag">
            <span className="live-review-pulse-dot" />
            <span className="live-review-badge-text">লাইভ গেস্ট রিভিউ</span>
            <span className="live-review-index-pill">
              {currentIndex + 1}/{BENGALI_REVIEWS.length}
            </span>
          </div>

          <div className="live-review-top-controls">
            {/* 5 Golden Stars */}
            <div className="live-review-stars" title="৫ এর মধ্যে ৫ রেটিং">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="#facc15" color="#facc15" />
              ))}
            </div>

            {/* Minimize toggle */}
            <button
              type="button"
              className="live-review-control-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              title="ছোট করুন (Minimize)"
            >
              <Minimize2 size={13} />
            </button>

            {/* Dismiss / Close */}
            <button
              type="button"
              className="live-review-control-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsClosed(true);
              }}
              title="বন্ধ করুন (Close)"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Bengali Review Text */}
        <div className="live-review-body">
          <MessageSquareQuote size={20} className="live-review-quote-icon" />
          <p className="live-review-text">
            &ldquo;{current.text}&rdquo;
          </p>
        </div>

        {/* Reviewer Details Row */}
        <div className="live-review-user-row">
          <div className="live-review-user-info">
            <div className="live-review-avatar">
              {current.initial}
            </div>
            <div className="live-review-name-wrap">
              <span className="live-review-author">
                {current.name}
              </span>
              <span className="live-review-location">
                {current.city} &bull; <strong className="live-review-stay-highlight">{current.stay}</strong>
              </span>
            </div>
          </div>

          <div className="live-review-meta-right">
            <span className="live-review-verified-badge">
              <CheckCircle2 size={11} /> ভেরিফায়েড গেস্ট
            </span>
            <span className="live-review-time">
              {current.time}
            </span>
          </div>
        </div>

        {/* Bottom Bar: Action prompt + Nav buttons */}
        <div className="live-review-footer">
          <div className="live-review-cta-hint">
            <span>বুকিং করতে ক্লিক করুন</span>
            <span className="live-review-cta-arrow">&rarr;</span>
          </div>

          <div className="live-review-nav-btns" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="live-review-nav-arrow"
              onClick={handlePrev}
              title="আগের রিভিউ"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              className="live-review-nav-arrow"
              onClick={handleNext}
              title="পরের রিভিউ"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Auto-rotation Progress Bar */}
        <div
          className="live-review-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
