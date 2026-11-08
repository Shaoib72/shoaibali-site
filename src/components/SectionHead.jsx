import { motion } from 'framer-motion';
import { useMotionPref } from '../context/MotionContext';

const ease = [0.22, 1, 0.36, 1];

export default function SectionHead({ index, label, title, lead }) {
  const { motionOn } = useMotionPref();

  return (
    <motion.header
      className="section-head"
      initial={motionOn ? { opacity: 0, y: 24 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="section-eyebrow">
        <span className="section-index">{index}</span>
        <span className="section-rule" aria-hidden />
        <span className="section-label">{label}</span>
      </div>
      <h2 className="section-title">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </motion.header>
  );
}
