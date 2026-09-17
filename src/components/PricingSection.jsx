import React, { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "917076973613"; // +91 7076973613

// ─── HELPER COMPONENT: MIcon ───────────────────────────────────────────────
export function MIcon({
  name,
  size = 20,
  weight = 400,
  fill = 0,
  grade = 0,
  opticalSize = 24,
  className,
}) {
  return (
    <span
      className={cn("material-symbols-outlined select-none leading-none", className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
      }}
    >
      {name}
    </span>
  );
}

// ─── HELPER COMPONENT: FadeUp ─────────────────────────────────────────────
export function FadeUp({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── HELPER COMPONENT: SpotlightBorder ────────────────────────────────────
export function SpotlightBorder({
  children,
  className,
  radius = "2xl",
  size = 520,
  intensity = 0.5,
}) {
  const containerRef = useRef(null);

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty("--spot-x", `${x}px`);
    containerRef.current.style.setProperty("--spot-y", `${y}px`);
  };

  const handlePointerLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty("--spot-x", "-9999px");
    containerRef.current.style.setProperty("--spot-y", "-9999px");
  };

  const radiusClass = radius === "2xl" ? "rounded-2xl" : `rounded-${radius}`;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("relative group", radiusClass, className)}
      style={{
        "--spot-x": "-9999px",
        "--spot-y": "-9999px",
        "--size": `${size}px`,
        "--intensity": intensity,
      }}
    >
      {/* Outer static border */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none border border-white/10",
          radiusClass
        )}
      />

      {/* Cursor spotlight border using CSS mask (1px ring painted by radial gradient) */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-300",
          radiusClass
        )}
        style={{
          padding: "1px",
          background: `radial-gradient(circle var(--size) at var(--spot-x) var(--spot-y), rgba(255, 255, 255, var(--intensity)), transparent 60%)`,
          WebkitMask: `linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)`,
          WebkitMaskComposite: "xor",
          mask: `linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)`,
          maskComposite: "exclude",
        }}
      />

      {/* Inner content (pointer events enabled) */}
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}

// ─── HELPER COMPONENT: AnimatedText for Buttons (Text-up-from-below) ──────
export function ButtonAnimatedText({ children, className }) {
  return (
    <span className={cn("relative inline-flex flex-col h-[1.15em] overflow-hidden leading-none", className)}>
      <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute top-full left-0 inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full">
        {children}
      </span>
    </span>
  );
}

// ─── HELPER COMPONENT: PrimaryButton ──────────────────────────────────────
export function PrimaryButton({
  children,
  href,
  onClick,
  size = "sm",
  className,
}) {
  const sizeClasses = size === "sm" ? "h-8 px-4 text-sm" : "h-10 px-6 text-base";
  const commonClasses = cn(
    "group inline-flex items-center justify-center rounded-full font-inter leading-none bg-white/80 hover:bg-white text-black transition-colors duration-200 cursor-pointer select-none",
    sizeClasses,
    className
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={commonClasses} onClick={onClick}>
        <ButtonAnimatedText>{children}</ButtonAnimatedText>
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={commonClasses}>
      <ButtonAnimatedText>{children}</ButtonAnimatedText>
    </button>
  );
}

// ─── HELPER COMPONENT: SecondaryButton ────────────────────────────────────
export function SecondaryButton({
  children,
  href,
  onClick,
  size = "sm",
  className,
}) {
  const sizeClasses = size === "sm" ? "h-8 px-4 text-sm" : "h-10 px-6 text-base";
  const commonClasses = cn(
    "group inline-flex items-center justify-center rounded-full font-inter leading-none bg-landing-surface hover:bg-landing-surface-hover border border-landing-border text-foreground backdrop-blur-[2.5px] font-medium transition-colors duration-200 cursor-pointer select-none",
    sizeClasses,
    className
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={commonClasses} onClick={onClick}>
        <ButtonAnimatedText>{children}</ButtonAnimatedText>
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={commonClasses}>
      <ButtonAnimatedText>{children}</ButtonAnimatedText>
    </button>
  );
}

// ─── BONO BARI ECO RESORT PLANS DATA ───────────────────────────────────────
export const bonoBariPlans = [
  {
    name: "Day Outing & Bonobhoj Feast",
    nameBn: "ডে-আউটিং ও বনভোজ ফিস্ট",
    price: "1,499",
    originalPrice: "2,499",
    currency: "₹",
    perUnit: "/ guest",
    perUnitBn: "/ জন",
    description: "Full day retreat (9 AM to 6 PM) with authentic lunch & guided forest trails.",
    descriptionBn: "সকাল ৯টা থেকে সন্ধ্যা ৬টা পর্যন্ত সম্পূর্ণ দিনযাপন, শালবন ট্রেইল ও ঐতিহ্যবাহী মধ্যাহ্নভোজ।",
    bg: "#161616",
    buttonText: "Book Day Visit",
    buttonTextBn: "ডে-ভিজিট বুক করুন",
    features: [
      { text: "Guided Sal forest nature exploration trail", textBn: "শাল ও মহুয়া বনের গাইড সহ জঙ্গল ট্রেইল", included: true },
      { text: "Authentic Bonobhoj Bengali Thali lunch", textBn: "বনভোজ স্পেশাল খাঁটি বাঙালি মধ্যাহ্নভোজ", included: true },
      { text: "Evening clay-cup chai & village snacks", textBn: "মাটির ভাঁড়ের তুলসী আদা চা ও মুচমুচে স্ন্যাক্স", included: true },
      { text: "Overnight luxury mud & bamboo cottage stay", textBn: "রাত্রিযাপনের জন্য ঐতিহ্যবাহী মাটির কটেজ", included: false },
      { text: "Starlit campfire & Santhali folk performance", textBn: "সন্ধ্যার অগ্নিকুণ্ড ও সাঁওতালি আদিবাসী নৃত্য", included: false },
    ],
  },
  {
    name: "Overnight Forest Retreat Villa",
    nameBn: "নাইট ফরেস্ট রিট্রিট কটেজ",
    price: "3,899",
    originalPrice: "5,999",
    currency: "₹",
    perUnit: "/ cottage (2 guests)",
    perUnitBn: "/ কটেজ (২ জন)",
    description: "Complete luxury eco stay with 4 meals, starlit campfire & tribal music night.",
    descriptionBn: "ঐতিহ্যবাহী মাটির কটেজে রাত্রিযাপন, ৪ বেলা সুস্বাদু আহার ও সান্ধ্য ক্যাম্পফায়ার।",
    bg: "#252525",
    featured: true,
    badge: "Best Value",
    badgeBn: "সবচেয়ে জনপ্রিয়",
    buttonText: "Reserve Cottage",
    buttonTextBn: "কটেজ বুকিং করুন",
    features: [
      { text: "Handcrafted mud & bamboo luxury cottage stay", textBn: "প্রাকৃতিক শীতাতপ নিয়ন্ত্রিত মাটির তৈরি কটেজ", included: true },
      { text: "All 4 meals (Breakfast, Thali, Snacks, Dinner)", textBn: "৪ বেলা খাঁটি বাঙালি আহার (প্রাতরাশ, মধ্যাহ্ন ও নৈশভোজ)", included: true },
      { text: "Evening private campfire & tribal folk music", textBn: "সন্ধ্যার ক্যাম্পফায়ার ও আদিবাসী সান্ধ্য সাংস্কৃতিক অনুষ্ঠান", included: true },
      { text: "Sunrise Sal & Mahua forest exploration walk", textBn: "ভোরবেলার শালবন পাখি দর্শন ও গাইডেড ওয়াক", included: true },
      { text: "Complimentary resort parking & high-speed WiFi", textBn: "ফ্রি পার্কিং ও হাই-স্পিড রিসর্ট ইন্টারনেট", included: true },
    ],
  },
];

// Fallback alias for spec compatibility
export const plans = bonoBariPlans;

// ─── PRICING CARD COMPONENT ───────────────────────────────────────────────
export function PricingCard({ plan, isBn = false, onSelectPlan }) {
  const displayName = isBn ? plan.nameBn : plan.name;
  const displayDesc = isBn ? plan.descriptionBn : plan.description;
  const displayBadge = isBn ? (plan.badgeBn || plan.badge) : plan.badge;
  const displayUnit = isBn ? (plan.perUnitBn || plan.perUnit) : plan.perUnit;
  const displayBtnText = isBn ? plan.buttonTextBn : plan.buttonText;

  // Direct WhatsApp booking message url
  const waText = isBn
    ? `🌿 *বোনো বাড়ি ইকো রিসর্ট - বুকিং অনুসন্ধান* 🌿
📍 জঙ্গল খাস, ঝাড়গ্রাম, পশ্চিমবঙ্গ

📋 *নির্বাচিত প্যাকেজ:* ${plan.nameBn} (${plan.name})
💰 *মূল্য:* ₹${plan.price} ${plan.perUnitBn || ''}
📝 *প্যাকেজ বিবরণ:* ${plan.descriptionBn}

নমস্কার! আমি বোনো বাড়িতে আসার জন্য এই প্যাকেজটি বুক করতে আগ্রহী। তারিখ ও সহজলভ্যতা সম্পর্কে জানতে চাই।`
    : `🌿 *BONO BARI ECO RESORT - RESERVATION INQUIRY* 🌿
📍 Jangal Khas, Jhargram, West Bengal

📋 *Selected Package:* ${plan.name}
💰 *Rate:* ₹${plan.price} ${plan.perUnit || ''}
📝 *Package Details:* ${plan.description}

Hello! I would like to reserve this stay package at Bono Bari Eco Resort. Please share date availability.`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

  return (
    <SpotlightBorder
      radius="2xl"
      size={460}
      intensity={0.5}
      className="relative h-full p-2 sm:p-3"
    >
      <div
        className="relative flex h-full flex-col rounded-2xl border border-white/10 p-7 sm:p-8"
        style={{ backgroundColor: plan.bg }}
      >
        {displayBadge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-white px-3 py-1 text-xs font-medium text-black">
            {displayBadge}
          </div>
        )}

        <FadeUp delay={0}>
          <div className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">
            {displayName}
          </div>
        </FadeUp>
        <div className="mt-3 border-t border-white/10" />

        <FadeUp delay={0.1}>
          <div className="mt-10 flex flex-wrap items-baseline gap-2">
            <span className="text-[2.75rem] leading-none font-normal tracking-tight text-foreground">
              {plan.currency || "₹"}{plan.price}
            </span>
            {plan.originalPrice && (
              <span className="text-lg text-foreground/40 line-through">
                {plan.currency || "₹"}{plan.originalPrice}
              </span>
            )}
            {displayUnit && (
              <span className="text-xs text-foreground/50 font-normal ml-1">
                {displayUnit}
              </span>
            )}
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="mt-4 text-sm leading-relaxed text-foreground/60">
            {displayDesc}
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="mt-7">
            {plan.featured ? (
              <PrimaryButton
                href={whatsappUrl}
                onClick={() => onSelectPlan && onSelectPlan(plan)}
                size="sm"
              >
                {displayBtnText || "Reserve Cottage"}
              </PrimaryButton>
            ) : (
              <SecondaryButton
                href={whatsappUrl}
                onClick={() => onSelectPlan && onSelectPlan(plan)}
                size="sm"
              >
                {displayBtnText || "Book Day Visit"}
              </SecondaryButton>
            )}
          </div>
        </FadeUp>

        <FadeUp delay={0.4}>
          <ul className="mt-7 flex flex-1 flex-col gap-2">
            {plan.features.map((f, i) => {
              const text = isBn ? (f.textBn || f.text) : f.text;
              return (
                <li
                  key={f.text}
                  className={cn(
                    "flex items-center gap-3 py-4 text-sm",
                    i !== 0 && "border-t border-white/10",
                    f.included ? "text-foreground/85" : "text-foreground/40"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border",
                      f.included
                        ? "border-white/20 bg-white/[0.06]"
                        : "border-white/10 bg-transparent"
                    )}
                  >
                    {f.included ? (
                      <MIcon name="check" size={12} className="text-foreground" />
                    ) : (
                      <MIcon name="close" size={12} className="text-foreground/50" />
                    )}
                  </span>
                  <span>{text}</span>
                </li>
              );
            })}
          </ul>
        </FadeUp>
      </div>
    </SpotlightBorder>
  );
}

// ─── MAIN PRICING SECTION ─────────────────────────────────────────────────
export default function PricingSection({ language = "en", onSelectPlan }) {
  const isBn = language === "bn";

  return (
    <section
      id="pricing"
      className="relative w-full bg-background py-12 sm:py-16 font-inter"
    >
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        {/* HEADER */}
        <div className="mb-14 flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <FadeUp>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-landing-surface border border-white/10 px-3 py-1 text-xs text-foreground/80 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
                {isBn ? "বোনো বাড়ি প্যাকেজ ও মূল্য" : "Bono Bari Stays & Pricing"}
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.02em] leading-[1.05] text-foreground">
                {isBn ? (
                  <>
                    স্বচ্ছ ও সাশ্রয়ী প্যাকেজ
                    <br className="hidden sm:block" /> শালবনের কোলে পরম শান্তি।
                  </>
                ) : (
                  <>
                    Clear pricing plans
                    <br className="hidden sm:block" /> that scale with you.
                  </>
                )}
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.2}>
            <p className="max-w-sm text-sm sm:text-base text-foreground/60">
              {isBn
                ? "খাঁটি শালবনের নির্জন দিনযাপন ও ঐতিহ্যবাহী মাটির কটেজ। আপনার সুবিধার সাথে মানানসই সেরা প্ল্যানটি বেছে নিন।"
                : "All-inclusive forest retreats. Pick the plan that fits how far you want to go in Jhargram."}
            </p>
          </FadeUp>
        </div>

        {/* CARDS */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          {bonoBariPlans.map((p) => (
            <PricingCard
              key={p.name}
              plan={p}
              isBn={isBn}
              onSelectPlan={onSelectPlan}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
