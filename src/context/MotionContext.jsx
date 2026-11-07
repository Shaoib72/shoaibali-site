import { createContext, useContext, useEffect, useState } from 'react';

const MotionContext = createContext(null);

export function MotionProvider({ children }) {
  const [motionOn, setMotionOn] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const saved = localStorage.getItem('motion');
      if (saved !== null) return saved === 'on';
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.dataset.motion = motionOn ? 'on' : 'off';
    try {
      localStorage.setItem('motion', motionOn ? 'on' : 'off');
    } catch {
      // storage can be unavailable in private browsing
    }
  }, [motionOn]);

  return (
    <MotionContext.Provider
      value={{
        motionOn,
        toggleMotion: () => setMotionOn((v) => !v),
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function useMotionPref() {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error('useMotionPref must be used within MotionProvider');
  return ctx;
}
