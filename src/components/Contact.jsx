import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data';
import { useMotionPref } from '../context/MotionContext';
import SectionHead from './SectionHead';

export default function Contact() {
  const { motionOn } = useMotionPref();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <SectionHead
          index="06"
          label="Contact"
          title={profile.contactTitle}
          lead={profile.contactBody}
        />

        <motion.div
          className="contact-panel glass"
          initial={motionOn ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="contact-main">
            <p className="contact-kicker">
              <span className="status-dot" aria-hidden />
              {profile.availability}
            </p>
            <a href={`mailto:${profile.email}`} className="contact-email">
              {profile.email}
            </a>
            <p className="contact-body">
              Have a project, a role, or a question? Send a note — I read every message and reply
              quickly.
            </p>
            <div className="contact-actions">
              <a href={`mailto:${profile.email}`} className="btn-primary">
                Start a conversation
                <span className="btn-arrow" aria-hidden>
                  ↗
                </span>
              </a>
              <button type="button" className="btn-ghost" onClick={copyEmail}>
                {copied ? 'Email copied ✓' : 'Copy email'}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? 'Email copied to clipboard' : ''}
              </span>
            </div>
          </div>

          <aside className="contact-side">
            <dl>
              <div>
                <dt>Location</dt>
                <dd>
                  {profile.locationShort} · {profile.timezone}
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
                </dd>
              </div>
              <div>
                <dt>Response time</dt>
                <dd>{profile.responseTime}</dd>
              </div>
            </dl>

            <div className="contact-links">
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={profile.cv} download>
                Download CV
              </a>
            </div>
          </aside>
        </motion.div>
      </div>
    </section>
  );
}
