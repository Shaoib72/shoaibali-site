import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { skillGroups, skills } from '../data';

export default function Skills() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="skills" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">03 — Skills</p>
          <h2 className="section-title">What I practice</h2>
        </div>

        <div className="skill-groups">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.title}
              className="skill-group glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <h3>{group.title}</h3>
              <div className="work-tags">
                {group.items.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="skills-meters">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              className="skill-meter"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="skill-top">
                <span>{skill.name}</span>
                <span className="skill-pct">{skill.level}%</span>
              </div>
              <div className="skill-track">
                <div
                  className={`skill-fill ${visible ? 'is-on' : ''}`}
                  style={{ '--level': `${skill.level}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
