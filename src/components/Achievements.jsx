import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { certifications, statsMeta } from '../data';

function useCountUp(target, active, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
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
  }, [target, active, decimals]);
  return value;
}

function Stat({ item, active, delay }) {
  const value = useCountUp(item.value, active, item.decimals || 0);
  return (
    <motion.div
      className="stat glass"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="stat-value">
        {value}
        {item.suffix}
      </div>
      <div className="stat-label">{item.label}</div>
    </motion.div>
  );
}

export default function Achievements() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

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
        <div className="section-head">
          <p className="section-kicker">05 — Highlights</p>
          <h2 className="section-title">Stats & certifications</h2>
        </div>

        <div className="stats-bar" ref={ref}>
          {statsMeta.map((stat, i) => (
            <Stat key={stat.label} item={stat} active={active} delay={i * 0.06} />
          ))}
        </div>

        <div className="certs">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert}
              className="cert glass"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
            >
              {cert}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
