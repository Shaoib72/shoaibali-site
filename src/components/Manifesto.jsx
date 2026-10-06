import { motion } from 'framer-motion';
import Reveal from './Reveal';

const lines = [
  { text: 'THE IDEA', weight: 'heavy' },
  { text: 'IS NOT', weight: 'light' },
  { text: 'to live forever', weight: 'italic' },
  { text: 'IT IS TO CREATE', weight: 'heavy' },
  { text: 'SOMETHING', weight: 'heavy' },
  { text: 'THAT WORKS.', weight: 'outline' },
];

export default function Manifesto() {
  return (
    <section className="section manifesto" aria-label="Manifesto">
      <div className="container">
        <Reveal>
          <p className="paren-label">(Manifesto)</p>
        </Reveal>
        <div className="manifesto-lines">
          {lines.map((line, i) => (
            <motion.p
              key={line.text}
              className={`manifesto-line manifesto-${line.weight}`}
              initial={{ opacity: 0, y: 48, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {line.text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
