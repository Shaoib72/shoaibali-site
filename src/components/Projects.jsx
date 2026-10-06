import { motion } from 'framer-motion';
import { works } from '../data';
import { useMotionPref } from '../context/MotionContext';

const ease = [0.22, 1, 0.36, 1];

export default function Projects() {
  const { motionOn } = useMotionPref();

  return (
    <section className="section" id="work">
      <div className="container">
        <motion.div
          className="section-head"
          initial={motionOn ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="section-kicker">02 — Work</p>
          <h2 className="section-title">Labs, experiments & tools</h2>
          <p className="section-lead">
            Selected projects across cybersecurity, computer vision, healthcare, and agriculture.
          </p>
        </motion.div>

        <div className="work-list">
          {works.map((work, i) => (
            <motion.article
              key={work.id}
              className="work-card glass"
              initial={motionOn ? { opacity: 0, y: 40, rotateX: 8 } : false}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.7, ease }}
              whileHover={motionOn ? { y: -8, scale: 1.01 } : undefined}
            >
              <div className="work-top">
                <span className="work-id">{work.id}</span>
                <span className="work-dates">{work.dates}</span>
              </div>
              <p className="work-kicker">{work.kicker}</p>
              <h3 className="work-title">{work.title}</h3>
              <p className="work-blurb">{work.blurb}</p>
              <div className="work-tags">
                {work.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="work-foot">
                <span className="work-status">{work.status}</span>
                <a href={work.href} target="_blank" rel="noreferrer" className="work-link">
                  View on GitHub →
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
