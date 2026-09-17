import React from 'react';
import { FadeIn } from './SharedComponents';
import { TRANSLATIONS } from '../translations';
import './ServicesSection.css';

export default function ServicesSection({ language = 'en' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isBn = language === 'bn';

  const servicesData = [
    {
      num: '01',
      name: t.service1Title,
      desc: t.service1Desc
    },
    {
      num: '02',
      name: t.service2Title,
      desc: t.service2Desc
    },
    {
      num: '03',
      name: t.service3Title,
      desc: t.service3Desc
    },
    {
      num: '04',
      name: t.service4Title,
      desc: t.service4Desc
    },
    {
      num: '05',
      name: t.service5Title,
      desc: t.service5Desc
    }
  ];

  return (
    <section className={`services-section ${isBn ? 'font-bengali' : ''}`} id="services">
      {/* Section Heading */}
      <FadeIn delay={0} y={40}>
        <div className="services-header-wrap">
          <h2 className="services-heading">
            {t.servicesBadge}
          </h2>
          <p className="services-subheading">
            {t.servicesSub}
          </p>
        </div>
      </FadeIn>

      {/* 5 Service items with staggered entrance */}
      <div className="services-list-container">
        {servicesData.map((svc, i) => (
          <FadeIn key={svc.num} delay={i * 0.1} y={30}>
            <div className="service-item-row">
              <span className="service-number">{svc.num}</span>
              <div className="service-content">
                <h3 className="service-title">{svc.name}</h3>
                <p className="service-description">{svc.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
