import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import markImg from '../../assets/mark.png';

export default function PageLoader() {
  const reduceMotion = useReducedMotion();

  const overlay = (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : .22 }}
      role="status"
      aria-label="Loading page"
      data-page-loader="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483000,
        background: '#0e0c0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        isolation: 'isolate',
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

  // Suspense can render this loader from inside an animated/transformed route wrapper.
  // A transformed ancestor changes the containing block for position:fixed, which can
  // make the loader appear below the fixed header. Portalling to document.body keeps
  // the loader truly viewport-fixed in both local and production builds.
  if (typeof document === 'undefined' || !document.body) return overlay;
  return createPortal(overlay, document.body);
}
