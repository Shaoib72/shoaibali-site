let lenis = null;

export function registerLenis(instance) {
  lenis = instance;
  return () => {
    if (lenis === instance) lenis = null;
  };
}

function motionAllowed() {
  return document.documentElement.dataset.motion !== 'off';
}

export function scrollToTarget(target) {
  if (typeof window === 'undefined') return;
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;

  if (lenis) {
    // Lenis reads the element's CSS scroll-margin-top itself.
    lenis.scrollTo(el, { duration: 1.2 });
    return;
  }

  el.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'auto', block: 'start' });
}

export function scrollToTop() {
  if (typeof window === 'undefined') return;

  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
    return;
  }

  window.scrollTo({ top: 0, behavior: motionAllowed() ? 'smooth' : 'auto' });
}

export function stopScroll() {
  lenis?.stop();
}

export function startScroll() {
  lenis?.start();
}
