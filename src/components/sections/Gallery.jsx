import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import Icon from '../ui/Icon';
import { GALLERY_ITEMS } from '../../data/siteData';
import g1 from '../../assets/gallery1.jpg';
import g2 from '../../assets/gallery2.jpg';
import g3 from '../../assets/gallery3.jpg';
import g4 from '../../assets/gallery4.jpg';
import iphone from '../../assets/hero-iphone.jpg';
import tech from '../../assets/hero-tech.jpg';
import board from '../../assets/hero-board.jpg';
import styles from './Gallery.module.css';

const IMGS = [g1, g2, tech, g3, board, g4, iphone];

export default function Gallery() {
  const outerRef = useRef(null);
  const dragState = useRef({ active: false, startX: 0, startScroll: 0, didDrag: false });
  const [dragging, setDragging] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return undefined;
    if (reduceMotion) { setHasAppeared(true); return undefined; }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasAppeared(true);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduceMotion]);

  const scrollGallery = (direction) => {
    const el = outerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.78, behavior: 'smooth' });
  };

  const handlePointerDown = (event) => {
    const el = outerRef.current;
    if (!el) return;
    dragState.current = {
      active: true,
      startX: event.clientX,
      startScroll: el.scrollLeft,
      didDrag: false,
    };
    setDragging(true);
    el.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const el = outerRef.current;
    const state = dragState.current;
    if (!el || !state.active) return;
    const delta = event.clientX - state.startX;
    if (Math.abs(delta) > 4) state.didDrag = true;
    el.scrollLeft = state.startScroll - delta;
  };

  const stopDrag = (event) => {
    const el = outerRef.current;
    if (!dragState.current.active) return;
    dragState.current.active = false;
    setDragging(false);
    try { el?.releasePointerCapture?.(event.pointerId); } catch { /* no-op */ }
  };

  const handleClick = (event) => {
    if (dragState.current.didDrag) {
      event.preventDefault();
      event.stopPropagation();
      dragState.current.didDrag = false;
    }
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <ScrollReveal>
            <div>
              <span className="tag"><Icon name="camera" size={14}/> Inside the Hub</span>
              <h2 style={{ marginTop: 14 }}>
                A look at our <span className="brand-text">repair floor</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className={styles.galleryControls} aria-label="Repair gallery controls">
            <button type="button" onClick={() => scrollGallery(-1)} aria-label="Previous repair photos">←</button>
            <button type="button" onClick={() => scrollGallery(1)} aria-label="Next repair photos">→</button>
          </div>
        </div>
      </div>

      <div className={styles.galleryContainer}>
        <div
          ref={outerRef}
          className={`${styles.outer} ${dragging ? styles.dragging : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onClickCapture={handleClick}
        >
          <div className={styles.strip}>
            {GALLERY_ITEMS.map((g, i) => {
              const yVal = parseInt(g.y, 10) || 0;
              return (
                <motion.article
                  key={g.label}
                  className={styles.frame}
                  initial={reduceMotion ? false : { opacity: 0, x: 30, scale: .94 }}
                  animate={hasAppeared
                    ? { opacity: 1, x: 0, y: reduceMotion ? 0 : yVal, rotate: reduceMotion ? 0 : g.rot, scale: 1 }
                    : { opacity: 0, x: 30, scale: .94 }}
                  transition={{
                    duration: reduceMotion ? 0 : .5,
                    delay: reduceMotion ? 0 : i * .04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={reduceMotion ? undefined : {
                    scale: 1.025,
                    y: yVal - 5,
                    transition: { duration: .22 },
                  }}
                >
                  <img src={IMGS[i % IMGS.length]} alt={g.label} loading="lazy" decoding="async" draggable="false" />
                  <div className={styles.frameGradient} />
                  <div className={styles.frameLabel}>{g.label}</div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
