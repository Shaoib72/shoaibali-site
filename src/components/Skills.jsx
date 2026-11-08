import { motion } from 'framer-motion';
import { exploring, skillGroups } from '../data';
import { useMotionPref } from '../context/MotionContext';
import SectionHead from './SectionHead';

export default function Skills() {
  const { motionOn } = useMotionPref();

  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHead
          index="03"
          label="Skills"
          title="Capabilities & stack"
          lead="The tools I reach for, grouped by how I use them."
        />

        <div className="skill-groups">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.title}
              className="skill-group glass"
              initial={motionOn ? { opacity: 0, y: 20 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="skill-group-index">0{i + 1}</span>
              <h3>{group.title}</h3>
              <p className="skill-group-blurb">{group.blurb}</p>
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

        <motion.div
          className="exploring glass"
          initial={motionOn ? { opacity: 0, y: 16 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16, duration: 0.6 }}
        >
          <span className="exploring-label">Currently exploring</span>
          {exploring.map((item) => (
            <span key={item} className="exploring-chip">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
