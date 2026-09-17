import React from 'react';
import { FadeIn, AnimatedText, ContactButton } from './SharedComponents';
import { TRANSLATIONS } from '../translations';
import './AboutSection.css';

export default function AboutSection({ onBookNowClick, language = 'en' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isBn = language === 'bn';

  const paragraphText = isBn
    ? "পশ্চিমবঙ্গের ঝাড়গ্রামের লাল মাটির প্রাচীন শাল ও মহুয়া বনের বুকে গড়ে উঠেছে বোনো বাড়ি ইকো রিসর্ট — প্রকৃতিপ্রেমী ও শান্তিপ্রিয় মানুষদের এক পরম ঠিকানা। পরিবেশবান্ধব মাটির কটেজ, বুনো জঙ্গল ট্রেইল, বনভোজের খাঁটি গ্রামীণ ভোজ এবং তারায় ভরা আকাশের নিচে খোলা ক্যাম্পফায়ার আপনার মন ভরিয়ে দেবে। আসুন, প্রকৃতির সাথে নিজেকে নতুন করে আবিষ্কার করুন!"
    : "Tucked away in the ancient red-soil Sal and Mahua forests of Jhargram, West Bengal, Bono Bari Eco Resort is a sustainable haven crafted for nature lovers, adventurers, and peace-seekers. We focus on low-impact eco-cottages, native forest trails, tribal gastronomy, and starlit campfire nights that rekindle your bond with Mother Earth. Let's create an unforgettable escape together!";

  return (
    <section className={`about-section ${isBn ? 'font-bengali' : ''}`} id="about">
      {/* 1. Four Decorative Corner 3D Images */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="about-decor-moon"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="Moon 3D Decor"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </FadeIn>

      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="about-decor-p59"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="Abstract 3D Shape"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </FadeIn>

      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="about-decor-lego"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="Lego 3D Decor"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </FadeIn>

      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="about-decor-group"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="Geometric 3D Decor"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </FadeIn>

      {/* 2. Main Content Stack */}
      <div className="about-content-stack">
        {/* Heading */}
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading about-heading">
            {t.aboutTitle}
          </h2>
        </FadeIn>

        <div className="about-spacer-top" />

        {/* Animated Paragraph with character-by-character scroll opacity */}
        <AnimatedText
          key={language}
          text={paragraphText}
          className="about-paragraph"
        />

        <div className="about-spacer-bottom" />

        {/* Book Now Button */}
        <FadeIn delay={0.2} y={20}>
          <ContactButton
            label={t.aboutBookBtn}
            onClick={onBookNowClick}
          />
        </FadeIn>
      </div>
    </section>
  );
}
