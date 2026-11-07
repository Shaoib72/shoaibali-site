import { useEffect, useState } from 'react';
import { navLinks, profile } from '../data';
import { useMotionPref } from '../context/MotionContext';
import { scrollToTarget, startScroll, stopScroll } from '../lib/scroll';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { motionOn, toggleMotion } = useMotionPref();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    if (open) stopScroll();
    else startScroll();
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1024) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const go = (id) => {
    setOpen(false);
    startScroll();
    // Wait for the menu's scroll lock to be released before measuring the target.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToTarget(id));
    });
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="nav-inner">
        <a
          href="#home"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            go('home');
          }}
        >
          <span className="logo-mark">{profile.siteLabel}</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          <button
            type="button"
            className="nav-links-motion"
            onClick={toggleMotion}
            aria-pressed={motionOn}
          >
            Motion {motionOn ? 'on' : 'off'}
          </button>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(link.id);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="motion-toggle"
            onClick={toggleMotion}
            aria-pressed={motionOn}
          >
            Motion {motionOn ? 'on' : 'off'}
          </button>
          <a href={`mailto:${profile.email}`} className="nav-mail">
            Contact
          </a>
          <button
            type="button"
            className="menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menu-btn-bars" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span className="menu-btn-label">{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </div>

      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
