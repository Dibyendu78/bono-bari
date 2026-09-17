import React, { useState, useEffect, useRef } from 'react';

export default function Navbar({ onBookClick, onExploreClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const navrowRef = useRef(null);
  const burgerRef = useRef(null);

  // Close on click outside or Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        if (burgerRef.current) burgerRef.current.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (
        isOpen &&
        navrowRef.current &&
        !navrowRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (e, callback) => {
    setIsOpen(false);
    if (callback) {
      e.preventDefault();
      callback();
    }
  };

  return (
    <header className="navbar">
      <div
        className="navrow"
        ref={navrowRef}
        data-open={isOpen ? 'true' : 'false'}
      >
        <a className="logo" href="#" onClick={(e) => handleLinkClick(e)}>
          bono<i>bari</i>
          <span className="logo-badge">Eco Resort</span>
        </a>

        <nav className="links" id="site-nav">
          <a
            href="#overview"
            aria-current="page"
            onClick={(e) => handleLinkClick(e)}
          >
            Sanctuary
          </a>
          <a
            href="#forest"
            onClick={(e) => handleLinkClick(e)}
          >
            Sal Forest
          </a>
          <a
            href="#location"
            onClick={(e) => handleLinkClick(e, onExploreClick)}
          >
            Jhargram
          </a>
          <a
            href="#experience"
            onClick={(e) => handleLinkClick(e)}
          >
            Experiences
          </a>
          <a
            className="enroll"
            href="#book"
            onClick={(e) => handleLinkClick(e, onBookClick)}
          >
            Book Stay
          </a>
        </nav>

        <button
          ref={burgerRef}
          className="burger"
          type="button"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-controls="site-nav"
          onClick={toggleOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
