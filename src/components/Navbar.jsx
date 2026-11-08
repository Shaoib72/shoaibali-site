import { useEffect, useState } from 'react';
import { navLinks, profile } from '../data';
import { useMotionPref } from '../context/MotionContext';
import { scrollToTarget, startScroll, stopScroll } from '../lib/scroll';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const { motionOn, toggleMotion } = useMotionPref();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const probe = window.innerHeight * 0.35;
      let current = '';
      for (const { id } of navLinks) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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
    setActive(id === 'home' ? '' : id);
    startScroll();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToTarget(id));
    });
  };

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="nav-inner">
          <a
            href="#home"
            className="logo"
            aria-label={`${profile.name} — home`}
            onClick={(e) => {
              e.preventDefault();
              go('home');
            }}
          >
            <span className="logo-badge" aria-hidden>
              S
            </span>
            <span className="logo-text">
              <span className="logo-name">{profile.name}</span>
              <span className="logo-role">AI / ML Engineer</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={active === link.id ? 'is-active' : undefined}
                aria-current={active === link.id ? 'true' : undefined}
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
              className="motion-switch"
              role="switch"
              aria-checked={motionOn}
              aria-label="Background motion"
              title={motionOn ? 'Turn motion off' : 'Turn motion on'}
              onClick={toggleMotion}
            >
              <span className="motion-switch-track" aria-hidden>
                <span className="motion-switch-thumb" />
              </span>
              <span className="motion-switch-label">Motion</span>
            </button>
            <a href={`mailto:${profile.email}`} className="nav-mail">
              Let&apos;s talk
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
      </header>

      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
