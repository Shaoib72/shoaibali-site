import { motion } from 'framer-motion';
import { profile, works } from '../data';
import { useMotionPref } from '../context/MotionContext';
import { scrollToTarget } from '../lib/scroll';
import SectionHead from './SectionHead';

const ease = [0.22, 1, 0.36, 1];

export default function Projects() {
  const { motionOn } = useMotionPref();

  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHead
          index="02"
          label="Work"
          title="Selected work"
          lead="Five projects across cybersecurity, computer vision, healthcare, and agriculture — built from data through deployment."
        />

        <div className="work-list">
          {works.map((work, i) => (
            <motion.article
              key={work.id}
              className={`work-card glass${work.featured ? ' is-featured' : ''}`}
              initial={motionOn ? { opacity: 0, y: 30 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.65, ease }}
              whileHover={motionOn ? { y: -3 } : undefined}
            >
              <div className="work-rail">
                <span className="work-id">{work.id}</span>
                <span className="work-dates">{work.dates}</span>
                {work.featured && <span className="work-featured">Featured</span>}
              </div>

              <div className="work-main">
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
              </div>

              <div className="work-side">
                <span className="work-status">{work.status}</span>
                {work.status.toLowerCase().includes('private') ? (
                  <button type="button" className="work-link" onClick={() => scrollToTarget('contact')}>
                    Discuss this project <span aria-hidden>↗</span>
                  </button>
                ) : work.status.toLowerCase().includes('client') ? (
                  <button type="button" className="work-link" onClick={() => scrollToTarget('contact')}>
                    Request case study <span aria-hidden>↗</span>
                  </button>
                ) : (
                  <a href={work.href} target="_blank" rel="noreferrer" className="work-link">
                    View on GitHub <span aria-hidden>↗</span>
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="section-foot">
          <a href={profile.github} target="_blank" rel="noreferrer" className="link-arrow">
            More projects on GitHub <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
