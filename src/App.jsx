import { lazy, Suspense } from 'react';
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
import Ambient from './components/Ambient';
import { profile } from './data';
import { useMotionPref } from './context/MotionContext';

const SceneBackground = lazy(() => import('./components/SceneBackground'));

export default function App() {
  const { motionOn } = useMotionPref();

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: motionOn ? 'smooth' : 'auto' });
  };

  return (
    <SmoothScroll>
      <div className="app light-theme">
        <ScrollProgress />
        <Ambient />
        <Suspense fallback={null}>
          <SceneBackground />
        </Suspense>
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
          <div className="container footer-inner">
            <p>© {new Date().getFullYear()} {profile.name}</p>
            <p className="footer-note">Stay curious. Keep building.</p>
            <motion.button
              type="button"
              className="to-top"
              onClick={toTop}
              whileHover={motionOn ? { y: -3, scale: 1.04 } : undefined}
              whileTap={motionOn ? { scale: 0.96 } : undefined}
            >
              Back to top ↑
            </motion.button>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
