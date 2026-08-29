import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress } from '../../hooks/useAnimations';

export function ProgressBar() {
  const progress = useScrollProgress();
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, height: 3,
      width: '100%', zIndex: 1000,
      background: 'rgba(245,130,32,0.1)',
    }}>
      <motion.div
        style={{
          height: '100%', transformOrigin: 'left',
          background: 'linear-gradient(90deg, #f58220, #ffaa50)',
          scaleX: progress,
        }}
      />
    </div>
  );
}

export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touchFirst = navigator.maxTouchPoints > 0;
    if (prefersReduced || touchFirst) return undefined;

    let target = window.scrollY;
    let current = window.scrollY;
    let rafId = null;

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
    const clamp = (value) => Math.max(0, Math.min(maxScroll(), value));

    const step = () => {
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.45) current = target;
      window.scrollTo(0, current);
      rafId = current === target ? null : requestAnimationFrame(step);
    };

    const onWheel = (e) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const path = e.composedPath?.() || [];
      const nativeScroll = path.some((node) => node?.dataset?.nativeScroll === 'true');
      if (nativeScroll) return;

      e.preventDefault();
      target = clamp(target + e.deltaY * 0.92);
      if (!rafId) {
        current = window.scrollY;
        rafId = requestAnimationFrame(step);
      }
    };

    const sync = () => {
      if (!rafId) {
        target = window.scrollY;
        current = window.scrollY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', sync, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', sync);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}

export function WaFab() {
  return (
    <motion.a
      className="wa-fab"
      href="https://wa.me/919025790266?text=Hi%2C%20I%20need%20a%20repair%20quote"
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp us"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 3, duration: 0.4, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.12 }}
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 300,
        width: 58, height: 58, borderRadius: '50%',
        background: '#25D366',
        display: 'grid', placeItems: 'center',
        boxShadow: '0 8px 30px rgba(37,211,102,.4)',
        cursor: 'pointer',
      }}
    >
      <motion.div
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: '#25D366',
        }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
      />
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ position: 'relative', zIndex: 1 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.11 1.517 5.843L.057 23.57a.75.75 0 0 0 .912.913l5.741-1.464A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.723 9.723 0 0 1-4.95-1.352l-.354-.21-3.664.935.956-3.54-.23-.368A9.718 9.718 0 0 1 2.25 12C2.25 6.614 6.614 2.25 12 2.25S21.75 6.614 21.75 12 17.386 21.75 12 21.75z"/>
      </svg>
    </motion.a>
  );
}
