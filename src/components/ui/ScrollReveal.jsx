import { useRef, useEffect } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up', // 'up' | 'left' | 'right' | 'scale'
  className = '',
  style = {},
}) {
  const ref = useRef(null);
  const controls = useAnimation();
  const reduceMotion = useReducedMotion();

  const dirVariants = {
    up:    { hidden: { opacity: 0, y: 28, rotateX: 5 }, visible: { opacity: 1, y: 0, rotateX: 0 } },
    left:  { hidden: { opacity: 0, x: -28 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 28 },  visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: .94 }, visible: { opacity: 1, scale: 1 } },
  };

  const chosen = dirVariants[direction] || dirVariants.up;

  useEffect(() => {
    if (reduceMotion) {
      controls.set('visible');
      return undefined;
    }
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
          obs.disconnect();
        }
      },
      { threshold: .06, rootMargin: '-20px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [controls, reduceMotion]);

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? 'visible' : 'hidden'}
      animate={controls}
      variants={chosen}
      transition={{
        duration: reduceMotion ? 0 : .48,
        delay: reduceMotion ? 0 : Math.min(delay, .22),
        ease: [.22, 1, .36, 1],
      }}
      style={{ transformStyle: 'preserve-3d', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
