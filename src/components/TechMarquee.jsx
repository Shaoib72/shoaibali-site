import { projects, techTicker } from '../data';

function Ribbon({ items, reverse = false, label }) {
  const loop = [...items, ...items, ...items];
  return (
    <div className={`ribbon ${reverse ? 'ribbon-reverse' : ''}`} aria-hidden>
      <div className="ribbon-track">
        {loop.map((item, i) => (
          <span key={`${label}-${item}-${i}`} className="ribbon-item">
            {item}
            <span className="ribbon-sep">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  const works = projects.map((p) => p.name);
  const cta = Array(8).fill("LET'S WORK");

  return (
    <div className="ribbon-stack">
      <Ribbon items={works} label="works" />
      <Ribbon items={techTicker} reverse label="tech" />
      <Ribbon items={cta} label="cta" />
    </div>
  );
}
