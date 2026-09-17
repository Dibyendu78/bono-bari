import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './SharedComponents.css';

/**
 * FadeIn — Framer Motion scroll entrance wrapper
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = '',
  style = {},
  as = 'div'
}) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
}

/**
 * Magnet — Mouse-following magnetic interactive effect
 */
export function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
  style = {}
}) {
  const magnetRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!magnetRef.current) return;
    const rect = magnetRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    magnetRef.current.style.transition = activeTransition;
    magnetRef.current.style.transform = `translate3d(${deltaX / strength}px, ${deltaY / strength}px, 0)`;
  };

  const handleMouseLeave = () => {
    if (!magnetRef.current) return;
    magnetRef.current.style.transition = inactiveTransition;
    magnetRef.current.style.transform = 'translate3d(0, 0, 0)';
  };

  return (
    <div
      className={`magnet-wrapper ${className}`}
      style={{ padding, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={magnetRef}>
        {children}
      </div>
    </div>
  );
}

/**
 * AnimatedChar — Individual letter scroll reveal
 */
function AnimatedChar({ char, progress, index, total }) {
  const start = index / total;
  const end = Math.min((index + 12) / total, 1);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="anim-char-container">
      <span className="anim-char-ghost">{char === ' ' ? '\u00A0' : char}</span>
      <motion.span style={{ opacity }} className="anim-char-visible">
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
}

/**
 * AnimatedWord — Preserves Indic/Bengali ligatures without breaking into dotted circles
 */
function AnimatedWord({ word, progress, index, total }) {
  const start = index / total;
  const end = Math.min((index + 4) / total, 1);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="anim-char-container" style={{ marginRight: '0.28em' }}>
      <span className="anim-char-ghost">{word}</span>
      <motion.span style={{ opacity }} className="anim-char-visible">
        {word}
      </motion.span>
    </span>
  );
}

/**
 * AnimatedText — Character or Word scroll-reveal paragraph
 */
export function AnimatedText({ text, className = '', style = {} }) {
  const textRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ['start 0.8', 'end 0.2']
  });

  // If text contains non-ASCII (e.g. Bengali Unicode \u0980-\u09FF), split by words to preserve ligatures!
  const hasBengali = /[\u0980-\u09FF]/.test(text);

  if (hasBengali) {
    const words = text.split(' ');
    return (
      <p ref={textRef} className={className} style={{ position: 'relative', ...style }}>
        {words.map((word, i) => (
          <AnimatedWord
            key={i}
            word={word}
            progress={scrollYProgress}
            index={i}
            total={words.length}
          />
        ))}
      </p>
    );
  }

  const chars = text.split('');

  return (
    <p ref={textRef} className={className} style={{ position: 'relative', ...style }}>
      {chars.map((char, i) => (
        <AnimatedChar
          key={i}
          char={char}
          progress={scrollYProgress}
          index={i}
          total={chars.length}
        />
      ))}
    </p>
  );
}

/**
 * ContactButton — Glowing pill button matching spec
 */
export function ContactButton({ label = 'Contact Me', onClick, href }) {
  if (href) {
    return (
      <a href={href} className="contact-btn">
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className="contact-btn">
      {label}
    </button>
  );
}

/**
 * LiveProjectButton — Ghost pill button matching spec
 */
export function LiveProjectButton({ label = 'Live Project', onClick, href }) {
  if (href) {
    return (
      <a href={href} className="live-project-btn" target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className="live-project-btn">
      {label}
    </button>
  );
}
