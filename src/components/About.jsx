import { motion } from 'framer-motion';
import { languages, profile } from '../data';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">01 — About</p>
          <h2 className="section-title">Who I am</h2>
        </div>

        <div className="about-grid">
          <motion.div
            className="about-story glass"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h3 className="about-title">
              {profile.aboutTitle.split('\n').map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </h3>
            <p>{profile.aboutBody}</p>
            <p className="about-extra">
              I work across the full loop: clean data, train models, ship interfaces, and automate
              workflows — with a preference for problems that matter in the real world.
            </p>
          </motion.div>

          <div className="about-side">
            <motion.div
              className="info-card glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <h4>Details</h4>
              <dl className="info-list">
                <div>
                  <dt>Name</dt>
                  <dd>{profile.name}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{profile.role}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{profile.location}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Nationality</dt>
                  <dd>{profile.nationality}</dd>
                </div>
              </dl>
            </motion.div>

            <motion.div
              className="info-card glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
            >
              <h4>Languages</h4>
              <ul className="lang-list">
                {languages.map((lang) => (
                  <li key={lang.name}>
                    <span>{lang.name}</span>
                    <strong>{lang.level}</strong>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
