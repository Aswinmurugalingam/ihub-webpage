import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import markImg from '../../assets/mark.png';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out'
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      const quick = window.setTimeout(() => onDone(), 160);
      return () => window.clearTimeout(quick);
    }

    const t1 = window.setTimeout(() => setPhase('hold'), 320);
    const t2 = window.setTimeout(() => setPhase('out'), 850);
    const t3 = window.setTimeout(() => onDone(), 1080);
    return () => [t1, t2, t3].forEach(window.clearTimeout);
  }, [onDone, reduceMotion]);

  return (
    <AnimatePresence>
      {phase !== 'out' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: .24, ease: [.22, 1, .36, 1] }}
          role="status"
          aria-label="Opening iHub"
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#0e0c0a',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 20,
          }}
        >
          <motion.div
            aria-hidden="true"
            initial={{ scale: .7, opacity: 0 }}
            animate={{ scale: 1.12, opacity: .18 }}
            transition={{ duration: .72, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: 'min(72vw, 420px)', height: 'min(72vw, 420px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,130,32,1), transparent 70%)',
              filter: 'blur(74px)',
              pointerEvents: 'none',
            }}
          />

          <motion.img
            src={markImg}
            alt="iHub"
            width="112"
            height="116"
            fetchPriority="high"
            decoding="async"
            initial={{ scale: .82, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: .42, ease: [.22, 1, .36, 1] }}
            style={{
              position: 'relative', zIndex: 1,
              width: 112, height: 116,
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 34px rgba(245,130,32,.55))',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
