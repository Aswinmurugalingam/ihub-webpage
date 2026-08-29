import { motion } from 'framer-motion';
import markImg from '../../assets/mark.png';

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: '#0e0c0a',
        backdropFilter: 'none',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16,
      }}
    >
      <motion.img
        src={markImg}
        alt="iHub"
        style={{
          width: 86, height: 86,
          objectFit: 'contain',
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.82, 1, 0.82],
          filter: [
            'drop-shadow(0 0 22px rgba(245,130,32,0.42))',
            'drop-shadow(0 0 58px rgba(245,130,32,0.9))',
            'drop-shadow(0 0 22px rgba(245,130,32,0.42))',
          ],
        }}
        transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
