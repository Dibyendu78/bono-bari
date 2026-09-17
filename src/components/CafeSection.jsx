import React, { useState } from 'react';
import { Utensils, MessageCircle, Sparkles } from 'lucide-react';
import { FadeIn } from './SharedComponents';
import './CafeSection.css';

const WHATSAPP_NUMBER = '917076973613';

// Exact menu items from the Bonobhoj Cafe screenshot
const MENU_ITEMS = [
  // ── Starters & Forest Bites ──
  {
    id: 'mochar-chop',
    name: 'Mochar Chop',
    price: 120,
    desc: 'Banana-flower fritters, mustard dip',
    category: 'Starters & Forest Bites',
    isVeg: true
  },
  {
    id: 'bamboo-shoot-fry',
    name: 'Bamboo-Shoot Fry',
    price: 140,
    desc: 'Forest bamboo, garlic, dry red chilli',
    category: 'Starters & Forest Bites',
    isVeg: true
  },
  {
    id: 'deshi-chicken-pakora',
    name: 'Deshi Chicken Pakora',
    price: 180,
    desc: 'Free-range chicken, home spice mix',
    category: 'Starters & Forest Bites',
    isVeg: false
  },
  {
    id: 'sabuj-bhorta-platter',
    name: 'Sabuj Bhorta Platter',
    price: 110,
    desc: 'Mashed greens, mustard oil, garlic',
    category: 'Starters & Forest Bites',
    isVeg: true
  },

  // ── Traditional Bengali Thalis ──
  {
    id: 'bonobhoj-special-thali',
    name: 'Bonobhoj Special Thali',
    price: 350,
    desc: 'Rice, dal, seasonal sabzi, fish curry, chutney',
    category: 'Traditional Bengali Thalis',
    isVeg: false,
    isSignature: true
  },
  {
    id: 'deshi-murgi-thali',
    name: 'Deshi Murgi Thali',
    price: 390,
    desc: 'Country chicken curry, rice, dal, salad',
    category: 'Traditional Bengali Thalis',
    isVeg: false
  },
  {
    id: 'niramish-thali',
    name: 'Niramish Thali',
    price: 280,
    desc: 'Pure vegetarian, five preparations, ghee rice',
    category: 'Traditional Bengali Thalis',
    isVeg: true
  },
  {
    id: 'ilish-bhaja-thali',
    name: 'Ilish Bhaja Thali',
    price: 450,
    desc: 'Fried hilsa, mustard rice, dal, sweet',
    category: 'Traditional Bengali Thalis',
    isVeg: false,
    isSpecial: true
  },

  // ── Refreshing Drinks ──
  {
    id: 'aam-panna',
    name: 'Aam Panna',
    price: 80,
    desc: 'Raw mango, roasted cumin, mint',
    category: 'Refreshing Drinks',
    isVeg: true
  },
  {
    id: 'lebu-sherbet',
    name: 'Lebu Sherbet',
    price: 70,
    desc: 'Fresh lime, black salt, soda',
    category: 'Refreshing Drinks',
    isVeg: true
  },
  {
    id: 'tulsi-adrak-chai',
    name: 'Tulsi Adrak Chai',
    price: 40,
    desc: 'Basil, ginger, slow-brewed over wood fire',
    category: 'Refreshing Drinks',
    isVeg: true
  },
  {
    id: 'matir-doi-lassi',
    name: 'Matir Doi Lassi',
    price: 90,
    desc: 'Clay-pot curd, jaggery',
    category: 'Refreshing Drinks',
    isVeg: true
  }
];

const CATEGORIES = [
  'All Items',
  'Starters & Forest Bites',
  'Traditional Bengali Thalis',
  'Refreshing Drinks'
];

export default function CafeSection({ onOrderClick }) {
  const [activeTab, setActiveTab] = useState('All Items');

  const filteredItems = activeTab === 'All Items'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeTab);

  const handleQuickInquire = (item) => {
    const text = `🌿 *Bonobhoj Cafe Enquiry - Bono Bari Resort* 🌿\n\n🍽️ *Dish:* ${item.name} (₹${item.price})\n📝 *Description:* ${item.desc}\n\nHi! I would like to enquire about ordering this during my visit to Bono Bari.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="cafe-section" id="cafe">
      {/* Header */}
      <div className="cafe-header">
        <FadeIn delay={0} y={20}>
          <div className="cafe-eyebrow">
            <Utensils size={13} />
            <span>Farm-To-Table Forest Gastronomy</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} y={30}>
          <h2 className="cafe-title">
            Bonobhoj Cafe
          </h2>
        </FadeIn>

        <FadeIn delay={0.2} y={20}>
          <p className="cafe-subtitle">
            &ldquo;Bonobhoj&rdquo; &mdash; a forest feast. Everything is cooked to order, mostly from what&apos;s grown within walking distance in the red soil of Jhargram.
          </p>
        </FadeIn>
      </div>

      {/* Filter Tabs */}
      <FadeIn delay={0.25} y={20}>
        <div className="cafe-tabs-container">
          {CATEGORIES.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`cafe-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Cards Grid */}
      <div className="cafe-grid">
        {filteredItems.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.05} y={25}>
            <div className="cafe-card">
              <div className="cafe-card-top">
                <div className="cafe-card-meta">
                  <div className="cafe-card-tags">
                    {item.isVeg ? (
                      <span className="cafe-tag-veg">
                        <span className="cafe-tag-dot-veg" />
                        <span>Veg</span>
                      </span>
                    ) : (
                      <span className="cafe-tag-nonveg">
                        <span className="cafe-tag-dot-nonveg" />
                        <span>Non-Veg</span>
                      </span>
                    )}
                    {item.isSignature && (
                      <span style={{ fontSize: '10px', color: '#facc15', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Sparkles size={11} /> Chef's Signature
                      </span>
                    )}
                  </div>
                  <h3 className="cafe-item-name">{item.name}</h3>
                </div>

                <div className="cafe-item-price">
                  ₹{item.price}
                </div>
              </div>

              <p className="cafe-item-desc">{item.desc}</p>

              <div className="cafe-card-bottom">
                <span className="cafe-category-badge">{item.category}</span>
                <button
                  type="button"
                  className="cafe-order-btn"
                  onClick={() => handleQuickInquire(item)}
                  title={`Enquire on WhatsApp: ${item.name}`}
                >
                  <MessageCircle size={14} />
                  <span>Enquire / Pre-Order</span>
                </button>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
