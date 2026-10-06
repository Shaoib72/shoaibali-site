import { createContext, useContext, useEffect, useState } from 'react';

const MotionContext = createContext(null);

export function MotionProvider({ children }) {
  const [motionOn, setMotionOn] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('motion');
    return saved === null ? true : saved === 'on';
  });

  useEffect(() => {
    document.documentElement.dataset.motion = motionOn ? 'on' : 'off';
    localStorage.setItem('motion', motionOn ? 'on' : 'off');
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
