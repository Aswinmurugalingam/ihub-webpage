import { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up', // 'up' | 'left' | 'right' | 'scale'
  className = '',
  style = {},
}) {
  const ref = useRef(null);
  const controls = useAnimation();

  const dirVariants = {
    up:    { hidden: { opacity: 0, y: 50, rotateX: 10 }, visible: { opacity: 1, y: 0, rotateX: 0 } },
    left:  { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 },  visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
  };

  const chosen = dirVariants[direction] || dirVariants.up;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { controls.start('visible'); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: '-40px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={chosen}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformStyle: 'preserve-3d', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
