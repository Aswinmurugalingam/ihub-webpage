import { useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function TiltCard({ children, className = '', style = {}, intensity = 8, onClick }) {
  const cardRef = useRef(null);
  const frameRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card || reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -intensity;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * intensity;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      card.style.boxShadow = '0 26px 64px -18px rgba(245,130,32,.36)';
      card.style.borderColor = 'rgba(245,130,32,.36)';
    });
  }, [intensity, reduceMotion]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (!card) return;
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    card.style.boxShadow = '';
    card.style.borderColor = '';
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ duration: reduceMotion ? 0 : .45, ease: [.22, 1, .36, 1] }}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        transition: reduceMotion ? 'none' : 'transform .32s cubic-bezier(.22,1,.36,1), box-shadow .32s, border-color .24s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
