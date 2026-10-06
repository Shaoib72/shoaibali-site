import { useEffect, useState } from 'react';
import { navLinks, profile } from '../data';
import { useMotionPref } from '../context/MotionContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { motionOn, toggleMotion } = useMotionPref();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: motionOn ? 'smooth' : 'auto' });
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
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
    </header>
  );
}
