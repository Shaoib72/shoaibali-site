import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { profile, skillStrip } from '../data';
import { useMotionPref } from '../context/MotionContext';

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
            className="eyebrow"
            initial={animate ? { opacity: 0, y: 18, filter: 'blur(8px)' } : false}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {profile.eyebrow}
          </motion.p>

          <motion.h1
            className="hero-name"
            initial={animate ? { opacity: 0, y: 40, scale: 0.98 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {profile.firstName}
            <br />
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
            initial={animate ? { opacity: 0, y: 18 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.a
              href="#work"
              className="btn-primary"
              whileHover={animate ? { y: -4, scale: 1.03 } : undefined}
              whileTap={animate ? { scale: 0.97 } : undefined}
            >
              View projects
            </motion.a>
            <motion.a
              href={profile.cv}
              className="btn-ghost"
              download
              whileHover={animate ? { y: -3 } : undefined}
            >
              Download CV
            </motion.a>
            <motion.a
              href={`mailto:${profile.email}`}
              className="btn-ghost"
              whileHover={animate ? { y: -3 } : undefined}
            >
              Email me
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          style={animate ? { y: yPhoto } : undefined}
          initial={animate ? { opacity: 0, scale: 0.92, rotate: -2 } : false}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="hero-photo-wrap"
            animate={
              animate
                ? { y: [0, -12, 0], rotate: [0, 1.2, 0] }
                : undefined
            }
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src={profile.photo} alt={profile.name} className="hero-photo" />
            <div className="hero-photo-glow" />
          </motion.div>
          <motion.div
            className="hero-meta-card"
            initial={animate ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
          >
            <span>Based in</span>
            <strong>{profile.location}</strong>
            <span>Open to</span>
            <strong>AI / ML roles & freelance</strong>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="skill-marquee" aria-hidden>
        <div className={`skill-marquee-track ${animate ? 'is-moving' : ''}`}>
          {[...skillStrip, ...skillStrip].map((item, i) => (
            <span key={`${item}-${i}`} className="skill-chip">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
