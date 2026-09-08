import { motion, useReducedMotion } from 'framer-motion';
import markImg from '../../assets/mark.png';

export default function PageLoader() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : .22 }}
      role="status"
      aria-label="Loading page"
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: '#0e0c0a',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16,
      }}
    >
      <motion.img
        src={markImg}
        alt=""
        aria-hidden="true"
        width="86"
        height="86"
        decoding="async"
        style={{ width: 86, height: 86, objectFit: 'contain' }}
        animate={reduceMotion ? { opacity: 1 } : {
          scale: [1, 1.08, 1],
          opacity: [.82, 1, .82],
          filter: [
            'drop-shadow(0 0 22px rgba(245,130,32,.42))',
            'drop-shadow(0 0 58px rgba(245,130,32,.9))',
            'drop-shadow(0 0 22px rgba(245,130,32,.42))',
          ],
        }}
        transition={reduceMotion ? undefined : { duration: 1.05, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
