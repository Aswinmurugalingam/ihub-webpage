import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function TiltCard({ children, className = '', style = {}, intensity = 10, onClick }) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -intensity;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * intensity;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    card.style.boxShadow = `0 32px 80px -16px rgba(245,130,32,0.45)`;
    card.style.borderColor = 'rgba(245,130,32,0.40)';
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.45s cubic-bezier(.22,1,.36,1), box-shadow 0.45s, border-color 0.3s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
