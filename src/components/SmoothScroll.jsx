import { useEffect } from 'react';
import Lenis from 'lenis';
import { useMotionPref } from '../context/MotionContext';

export default function SmoothScroll({ children }) {
  const { motionOn } = useMotionPref();

  useEffect(() => {
    if (!motionOn) return undefined;

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };
  }, [motionOn]);

  return children;
}
