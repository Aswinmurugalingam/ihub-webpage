import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Scroll progress 0-1 ───
// Throttled to one React update per animation frame to avoid excessive renders while scrolling.
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let rafId = 0;
    const update = () => {
      rafId = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  return progress;
}

// ─── Intersection observer reveal ───
export function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return undefined;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.08, rootMargin: '-24px', ...optionsRef.current });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── Count-up animation ───
export function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return undefined;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.45 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  useEffect(() => {
    if (!started) return undefined;
    let rafId = 0;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(ease * target));
      if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [started, target, duration]);

  return [ref, value];
}

// ─── 3D mouse tilt for a container ───
export function useMouseTilt(intensity = 8) {
  const ref = useRef(null);
  const rafRef = useRef(0);
  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -intensity;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * intensity;
      el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      el.style.transition = 'transform .08s ease-out';
    });
  }, [intensity]);
  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!el) return;
    el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    el.style.transition = 'transform .35s cubic-bezier(.22,1,.36,1)';
  }, []);
  return { ref, onMouseMove, onMouseLeave };
}

// ─── Gallery spring scroll ───
export function useGalleryScroll(sectionRef) {
  const stripRef = useRef(null);
  useEffect(() => {
    const section = sectionRef.current;
    const strip = stripRef.current;
    if (!section || !strip || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let currentX = 0, targetX = 0, rafId;
    const tick = () => {
      currentX += (targetX - currentX) * 0.1;
      strip.style.transform = `translateX(${-currentX}px) translateZ(0)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight * 0.6)));
      const maxX = Math.max(0, strip.scrollWidth - window.innerWidth + 80);
      targetX = progress * maxX * 0.7;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, [sectionRef]);
  return stripRef;
}
