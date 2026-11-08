import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { certifications, statsMeta } from '../data';
import { useMotionPref } from '../context/MotionContext';
import SectionHead from './SectionHead';

function useCountUp(target, active, decimals = 0) {
  const [value, setValue] = useState(0);
  const { motionOn } = useMotionPref();
  const reduce = useReducedMotion();
  const canAnimate = motionOn && !reduce;

  useEffect(() => {
    if (!canAnimate) {
      setValue(target);
      return undefined;
    }
    if (!active) {
      setValue(0);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const duration = 1200;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(Number((target * eased).toFixed(decimals)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, decimals, canAnimate]);

  return value;
}

function Stat({ item, active, delay }) {
  const value = useCountUp(item.value, active, item.decimals || 0);
  const { motionOn } = useMotionPref();

  return (
    <motion.div
      className="stat"
      initial={motionOn ? { opacity: 0, y: 16 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="stat-value">
        {value}
        <span className="stat-suffix">{item.suffix}</span>
      </div>
      <div className="stat-label">{item.label}</div>
    </motion.div>
  );
}

export default function Achievements() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const { motionOn } = useMotionPref();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="certs">
      <div className="container">
        <SectionHead
          index="05"
          label="Highlights"
          title="Numbers & credentials"
          lead="Selected signals of progress — measured where possible, verifiable where it matters."
        />

        <div className="stats-bar glass" ref={ref}>
          {statsMeta.map((stat, i) => (
            <Stat key={stat.label} item={stat} active={active} delay={i * 0.06} />
          ))}
        </div>

        <div className="certs-head">
          <h3>Certifications</h3>
          <span className="certs-count">{certifications.length} credentials</span>
        </div>

        <div className="cert-list">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert}
              className="cert"
              initial={motionOn ? { opacity: 0, y: 8 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.025, 0.3) }}
            >
              <span className="cert-check" aria-hidden>
                ✓
              </span>
              <span>{cert}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
