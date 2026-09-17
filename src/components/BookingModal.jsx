import React, { useState } from 'react';
import { X, Send, Calendar, User, Phone, Users, Home, MessageSquare, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import './BookingModal.css';

const WHATSAPP_NUMBER = '917076973613'; // +91 7076973613

export default function BookingModal({
  isOpen,
  onClose,
  initialStayType = 'Sal Forest Retreat Villa',
  language = 'en'
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isBn = language === 'bn';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '2 Guests',
    stayType: initialStayType,
    specialRequests: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert(isBn ? 'অনুগ্রহ করে আপনার নাম এবং মোবাইল নম্বর প্রদান করুন।' : 'Please provide both your Name and Phone Number.');
      return;
    }

    // Format clean, professional WhatsApp message
    const message = isBn
      ? `🌿 *বোনো বাড়ি ইকো রিসর্ট - নতুন বুকিং আবেদন* 🌿
📍 জঙ্গল খাস, ঝাড়গ্রাম, পশ্চিমবঙ্গ

👤 *অতিথির নাম:* ${formData.name.trim()}
📱 *ফোন / হোয়াটসঅ্যাপ:* ${formData.phone.trim()}
📅 *চেক-ইন তারিখ:* ${formData.checkIn || 'আলোচনা সাপেক্ষে'}
📅 *চেক-আউট তারিখ:* ${formData.checkOut || 'আলোচনা সাপেক্ষে'}
👥 *অতিথি সংখ্যা:* ${formData.guests}
🏡 *পছন্দের কটেজ:* ${formData.stayType}
💬 *বিশেষ অনুরোধ:* ${formData.specialRequests.trim() || 'কিছু নেই'}

✨ _ওয়েবসাইটের মাধ্যমে প্রেরিত_`
      : `🌿 *NEW BOOKING REQUEST - BONO BARI ECO RESORT* 🌿
📍 Jangal Khas, Jhargram, West Bengal

👤 *Guest Name:* ${formData.name.trim()}
📱 *Phone / WhatsApp:* ${formData.phone.trim()}
📅 *Check-in Date:* ${formData.checkIn || 'To be decided'}
📅 *Check-out Date:* ${formData.checkOut || 'To be decided'}
👥 *Guests:* ${formData.guests}
🏡 *Stay Preference:* ${formData.stayType}
💬 *Special Requests:* ${formData.specialRequests.trim() || 'None'}

✨ _Sent via Bono Bari Eco Resort Website_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    setSubmitted(true);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div className={`booking-modal-card ${isBn ? 'font-bengali' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className="booking-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="booking-modal-header">
              <div className="booking-modal-badge">
                <span>{isBn ? '🌿 রিসর্ট বুকিং উইন্ডো' : '🌿 Direct Resort Reservation'}</span>
              </div>
              <h2 className="booking-modal-title">{t.bookingModalTitle}</h2>
              <p className="booking-modal-subtitle">
                {t.bookingModalSub}
              </p>
            </div>

            {/* Form */}
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="booking-form-grid">
                {/* Name */}
                <div className="booking-field-group">
                  <label className="booking-label">
                    <User size={14} />
                    <span>{t.bookingNameLabel}</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={t.bookingNamePlaceholder}
                    className="booking-input"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="booking-field-group">
                  <label className="booking-label">
                    <Phone size={14} />
                    <span>{t.bookingPhoneLabel}</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder={t.bookingPhonePlaceholder}
                    className="booking-input"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="booking-form-grid">
                {/* Check-In */}
                <div className="booking-field-group">
                  <label className="booking-label">
                    <Calendar size={14} />
                    <span>{t.bookingCheckInLabel}</span>
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    className="booking-input"
                    value={formData.checkIn}
                    onChange={handleChange}
                  />
                </div>

                {/* Check-Out */}
                <div className="booking-field-group">
                  <label className="booking-label">
                    <Calendar size={14} />
                    <span>{isBn ? 'চেক-আউট তারিখ' : 'Check-Out Date'}</span>
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    className="booking-input"
                    value={formData.checkOut}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="booking-form-grid">
                {/* Stay Type */}
                <div className="booking-field-group">
                  <label className="booking-label">
                    <Home size={14} />
                    <span>{t.bookingStayLabel}</span>
                  </label>
                  <select
                    name="stayType"
                    className="booking-select"
                    value={formData.stayType}
                    onChange={handleChange}
                  >
                    <option value="Sal Forest Retreat Villa">Sal Forest Retreat Villa (শাল ফরেস্ট ভিলা)</option>
                    <option value="Jhargram Woodlands Cottage">Jhargram Woodlands Cottage (ঝাড়গ্রাম উডল্যান্ডস কটেজ)</option>
                    <option value="Rustic Mud & Terracotta Villa">Rustic Mud & Terracotta Villa (মাটির ঐতিহ্যবাহী ভিলা)</option>
                    <option value="Canopy Green Haven Room">Canopy Green Haven Room (ক্যানোপি গ্রিন রুম)</option>
                    <option value="Fireside Serenity Cottage">Fireside Serenity Cottage (ক্যাম্পফায়ার কটেজ)</option>
                    <option value="Bonobhoj Cafe Day Feast">Bonobhoj Cafe Day Feast (বনভোজ ডে-ভিজিট ফিস্ট)</option>
                  </select>
                </div>

                {/* Guests */}
                <div className="booking-field-group">
                  <label className="booking-label">
                    <Users size={14} />
                    <span>{t.bookingGuestsLabel}</span>
                  </label>
                  <select
                    name="guests"
                    className="booking-select"
                    value={formData.guests}
                    onChange={handleChange}
                  >
                    <option value="1 Guest">1 Guest (১ জন)</option>
                    <option value="2 Guests">2 Guests (২ জন)</option>
                    <option value="3 Guests">3 Guests (৩ জন)</option>
                    <option value="4 Guests">4 Guests (৪ জন)</option>
                    <option value="Family / Group (5+ Guests)">Family / Group 5+ (পরিবার / দলগত ৫+)</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div className="booking-field-group">
                <label className="booking-label">
                  <MessageSquare size={14} />
                  <span>{isBn ? 'বিশেষ কোনো অনুরোধ বা প্রশ্ন (ঐচ্ছিক)' : 'Special Requests or Queries (Optional)'}</span>
                </label>
                <textarea
                  name="specialRequests"
                  rows={2}
                  placeholder={isBn ? 'যেমন: ক্যাম্পফায়ার ব্যবস্থা, বনভোজের দেশি মুরগির থালি ইত্যাদি...' : 'e.g. Campfire request, bonfire dinner, extra beds...'}
                  className="booking-textarea"
                  value={formData.specialRequests}
                  onChange={handleChange}
                />
              </div>

              {/* Submit CTA */}
              <div className="booking-submit-row">
                <button type="submit" className="booking-submit-btn">
                  <Send size={16} />
                  <span>{t.bookingSubmitBtn}</span>
                </button>
              </div>

              <p className="booking-helpline-note">
                {t.bookingCallHint}
              </p>
            </form>
          </>
        ) : (
          /* Confirmation State */
          <div className="booking-success-wrap">
            <div className="booking-success-icon">
              <CheckCircle2 size={48} color="#22c55e" />
            </div>
            <h3 className="booking-success-title">
              {isBn ? 'হোয়াটসঅ্যাপ মেসেজ তৈরি হয়েছে!' : 'WhatsApp Ready!'}
            </h3>
            <p className="booking-success-desc">
              {isBn
                ? 'আপনার বুকিং বিবরণ সরাসরি আমাদের রিসর্ট ম্যানেজারের হোয়াটসঅ্যাপে পাঠানো হয়েছে। আমরা অবিলম্বে আপনার সাথে যোগাযোগ করব।'
                : 'Your booking enquiry has been formatted and opened in WhatsApp. Our manager will reply shortly to confirm availability.'}
            </p>
            <button
              type="button"
              className="booking-submit-btn"
              onClick={onClose}
            >
              {isBn ? 'বন্ধ করুন' : 'Done & Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
