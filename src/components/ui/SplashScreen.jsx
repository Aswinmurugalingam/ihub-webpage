import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import markImg from '../../assets/mark.png';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600);
    const t2 = setTimeout(() => setPhase('out'), 2200);
    const t3 = setTimeout(() => onDone(), 2900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== 'out' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#0e0c0a',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 24,
          }}
        >
          {/* Background glow */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 0.25 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: 500, height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,130,32,1), transparent 70%)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />

          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <motion.img
              src={markImg}
              alt="iHub"
              style={{
                width: 120, height: 120,
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 40px rgba(245,130,32,0.6))',
              }}
              animate={{
                filter: [
                  'drop-shadow(0 0 30px rgba(245,130,32,0.4))',
                  'drop-shadow(0 0 60px rgba(245,130,32,0.8))',
                  'drop-shadow(0 0 30px rgba(245,130,32,0.4))',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
