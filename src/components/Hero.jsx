import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { profile, skillStrip } from '../data';
import { useMotionPref } from '../context/MotionContext';
import { scrollToTarget } from '../lib/scroll';

export default function Hero() {
  const { motionOn } = useMotionPref();
  const reduce = useReducedMotion();
  const animate = motionOn && !reduce;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yPhoto = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  return (
    <section className="section hero" id="home" ref={ref}>
      <motion.div className="container hero-grid" style={animate ? { opacity } : undefined}>
        <motion.div className="hero-copy" style={animate ? { y: yCopy } : undefined}>
          <motion.p
            className="hero-badge"
            initial={animate ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="status-dot" aria-hidden />
            <span>{profile.availability}</span>
            <span className="hero-badge-divider" aria-hidden />
            <span className="hero-badge-loc">{profile.timezone}</span>
          </motion.p>

          <motion.h1
            className="hero-name"
            initial={animate ? { opacity: 0, y: 40 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{profile.firstName}</span>
            <span className="hero-name-accent">{profile.lastName}</span>
          </motion.h1>

          <motion.p
            className="hero-role"
            initial={animate ? { opacity: 0, x: -20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
          >
            {profile.role}
          </motion.p>

          <motion.p
            className="hero-headline"
            initial={animate ? { opacity: 0, y: 22 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
          >
            {profile.headline}
          </motion.p>

          <motion.p
            className="hero-summary"
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.8 }}
          >
            {profile.summary}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={animate ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
          >
            <motion.a
              href="#work"
              className="btn-primary"
              whileHover={animate ? { y: -3 } : undefined}
              whileTap={animate ? { scale: 0.98 } : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget('work');
              }}
            >
              View selected work
              <span className="btn-arrow" aria-hidden>
                ↗
              </span>
            </motion.a>
            <motion.a
              href={profile.cv}
              className="btn-ghost"
              download
              whileHover={animate ? { y: -3 } : undefined}
            >
              Download CV
            </motion.a>
          </motion.div>

          <motion.p
            className="hero-email"
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Or reach me directly at <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </motion.p>
        </motion.div>

        <motion.div
          className="hero-visual"
          style={animate ? { y: yPhoto } : undefined}
          initial={animate ? { opacity: 0, scale: 0.94 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="hero-photo-wrap"
            animate={animate ? { y: [0, -10, 0] } : undefined}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="hero-photo-frame" aria-hidden />
            <span className="hero-frame-label">Portfolio — 2026</span>
            <img
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              className="hero-photo"
              fetchPriority="high"
              decoding="async"
            />
            <div className="hero-photo-glow" aria-hidden />
          </motion.div>
          <motion.div
            className="hero-meta-card"
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
          >
            <div>
              <span>Based in</span>
              <strong>{profile.locationShort}</strong>
            </div>
            <div>
              <span>Focus</span>
              <strong>AI · ML · Data Science</strong>
            </div>
            <div>
              <span>Status</span>
              <strong className="is-open">
                <i aria-hidden /> Open to work
              </strong>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="container toolbox">
        <span className="toolbox-label">Toolbox</span>
        <div className="skill-marquee" aria-hidden>
          <div className={`skill-marquee-track ${animate ? 'is-moving' : ''}`}>
            {[...skillStrip, ...skillStrip].map((item, i) => (
              <span key={`${item}-${i}`} className="skill-chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
