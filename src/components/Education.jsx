import { motion } from 'framer-motion';
import { education, experience, profile } from '../data';
import { useMotionPref } from '../context/MotionContext';
import SectionHead from './SectionHead';

export default function Education() {
  const { motionOn } = useMotionPref();

  return (
    <section className="section" id="path">
      <div className="container">
        <SectionHead
          index="04"
          label="Path"
          title="Education & experience"
          lead="A foundation in teaching and IT, now focused on applied AI and data science."
        />

        <div className="path-grid">
          <div>
            <h3 className="path-label">Education</h3>
            <div className="timeline">
              {education.map((item, i) => (
                <motion.article
                  key={item.title}
                  className="timeline-card glass"
                  initial={motionOn ? { opacity: 0, x: -16 } : false}
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
                  initial={motionOn ? { opacity: 0, x: 16 } : false}
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

        <div className="section-foot">
          <a href={profile.cv} className="link-arrow" download>
            Download full CV <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
