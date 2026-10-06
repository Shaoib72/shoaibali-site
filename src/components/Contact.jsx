import { motion } from 'framer-motion';
import { profile } from '../data';

export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">06 — Contact</p>
          <h2 className="section-title">{profile.contactTitle}</h2>
          <p className="section-lead">{profile.contactBody}</p>
        </div>

        <motion.div
          className="contact-panel glass"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a href={`mailto:${profile.email}`} className="contact-email">
            {profile.email}
          </a>
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="contact-phone">
            {profile.phone}
          </a>

          <div className="contact-links">
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.cv} download>
              Curriculum vitae → View PDF
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
