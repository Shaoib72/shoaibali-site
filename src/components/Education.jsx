import { motion } from 'framer-motion';
import { education, experience } from '../data';

export default function Education() {
  return (
    <section className="section" id="path">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">04 — Path</p>
          <h2 className="section-title">Education & experience</h2>
        </div>

        <div className="path-grid">
          <div>
            <h3 className="path-label">Education</h3>
            <div className="timeline">
              {education.map((item, i) => (
                <motion.article
                  key={item.title}
                  className="timeline-card glass"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <p className="timeline-dates">{item.dates}</p>
                  <h4>{item.title}</h4>
                  <p className="timeline-meta">{item.place}</p>
                  {item.detail && <p className="timeline-detail">{item.detail}</p>}
                </motion.article>
              ))}
            </div>
          </div>

          <div>
            <h3 className="path-label">Experience</h3>
            <div className="timeline">
              {experience.map((item, i) => (
                <motion.article
                  key={`${item.role}-${item.org}`}
                  className="timeline-card glass"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <p className="timeline-dates">{item.dates}</p>
                  <h4>{item.role}</h4>
                  <p className="timeline-meta">{item.org}</p>
                  {item.points && (
                    <ul className="timeline-points">
                      {item.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
