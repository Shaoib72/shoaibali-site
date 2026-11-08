import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import SmoothScroll from './components/SmoothScroll';
import ScrollProgress from './components/ScrollProgress';
import { navLinks, profile } from './data';
import { useMotionPref } from './context/MotionContext';
import { scrollToTarget, scrollToTop } from './lib/scroll';

const SceneBackground = lazy(() => import('./components/SceneBackground'));

export default function App() {
  const { motionOn } = useMotionPref();
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setSceneReady(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setSceneReady(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <SmoothScroll>
      <div className="app">
        <ScrollProgress />
        {sceneReady && (
          <Suspense fallback={null}>
            <SceneBackground />
          </Suspense>
        )}
        <Navbar />
        <main id="main">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Education />
          <Achievements />
          <Contact />
        </main>
        <footer className="footer">
          <div className="container footer-grid">
            <div className="footer-brand">
              <a
                className="footer-logo"
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('home');
                }}
              >
                <span className="logo-badge is-inverse" aria-hidden>
                  S
                </span>
                <span className="footer-identity">
                  <span className="footer-name">{profile.name}</span>
                  <span className="footer-role">{profile.role}</span>
                </span>
              </a>
              <p>{profile.summary}</p>
              <p className="footer-location">
                {profile.locationShort} · {profile.timezone}
              </p>
            </div>

            <nav className="footer-col" aria-label="Footer sections">
              <h4>Explore</h4>
              <ul>
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToTarget(link.id);
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer-col">
              <h4>Elsewhere</h4>
              <ul>
                <li>
                  <a href={profile.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={`mailto:${profile.email}`}>Email</a>
                </li>
                <li>
                  <a href={profile.cv} download>
                    CV (PDF)
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </li>
                <li>
                  <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
                </li>
                <li>
                  <span>{profile.responseTime}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="container footer-base">
            <span>
              © {new Date().getFullYear()} {profile.name}
            </span>
            <span className="footer-note">Built with React, Three.js & care.</span>
            <motion.button
              type="button"
              className="to-top"
              onClick={scrollToTop}
              whileHover={motionOn ? { y: -2 } : undefined}
              whileTap={motionOn ? { scale: 0.97 } : undefined}
            >
              Back to top ↑
            </motion.button>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
