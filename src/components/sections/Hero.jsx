import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import iphoneImg from '../../assets/hero-iphone.jpg';
import techImg from '../../assets/hero-tech.jpg';
import boardImg from '../../assets/hero-board.jpg';
import galleryLaptop from '../../assets/gallery2.jpg';
import galleryStack from '../../assets/gallery4.jpg';
import styles from './Hero.module.css';

const proof = [
  ['search', 'Diagnosis first'],
  ['truck', 'Free mobile pickup'],
  ['tool', 'Multi-brand repair'],
  ['check', 'Quality checked'],
];

const repairCards = [
  {
    src: techImg,
    eyebrow: 'IHUB WORKSHOP',
    title: 'Precision Repair',
    description: 'Professional bench work with careful diagnosis, clean handling and quality checks before return.',
    chips: ['Workshop care', 'Quality check', 'Multi-device'],
  },
  {
    src: iphoneImg,
    eyebrow: 'IPHONE CARE',
    title: 'Display & Screen Repair',
    description: 'Display inspection and repair support for cracked, damaged or non-responsive iPhone screens.',
    chips: ['Display', 'Touch', 'Screen care'],
  },
  {
    src: boardImg,
    eyebrow: 'BOARD LAB',
    title: 'Chip-Level Diagnosis',
    description: 'Detailed board inspection for complex charging, power, liquid damage and component-level faults.',
    chips: ['Logic board', 'Power', 'Diagnostics'],
  },
  {
    src: galleryLaptop,
    eyebrow: 'MACBOOK & LAPTOP',
    title: 'Logic Diagnosis',
    description: 'Structured diagnosis for laptops and MacBooks covering power, board, display and charging issues.',
    chips: ['MacBook', 'Laptop', 'Board care'],
  },
  {
    src: galleryStack,
    eyebrow: 'MULTI-BRAND CARE',
    title: 'One Repair Hub',
    description: 'iPhone, Android, MacBook, laptop and tablet repair handled through one professional repair centre.',
    chips: ['iPhone', 'Android', 'Tablet'],
  },
];

function relativePosition(index, active, total) {
  let offset = (index - active + total) % total;
  if (offset > Math.floor(total / 2)) offset -= total;
  return offset;
}

function positionClass(offset) {
  if (offset === 0) return 'posCenter';
  if (offset === -1) return 'posLeftNear';
  if (offset === 1) return 'posRightNear';
  if (offset === -2) return 'posLeftFar';
  return 'posRightFar';
}

function StackedRepairShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % repairCards.length);
    }, 4400);
    return () => window.clearInterval(timer);
  }, [paused]);


  const handlePointerMove = (event) => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    stage.style.setProperty('--fan-rx', `${((0.5 - y) * 2.4).toFixed(2)}deg`);
    stage.style.setProperty('--fan-ry', `${((x - 0.5) * 3.4).toFixed(2)}deg`);
    stage.style.setProperty('--glow-x', `${(x * 100).toFixed(1)}%`);
    stage.style.setProperty('--glow-y', `${(y * 100).toFixed(1)}%`);
  };

  const resetPerspective = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty('--fan-rx', '0deg');
    stage.style.setProperty('--fan-ry', '0deg');
    stage.style.setProperty('--glow-x', '50%');
    stage.style.setProperty('--glow-y', '42%');
  };

  return (
    <div
      className={styles.showcaseShell}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        resetPerspective();
      }}
    >
      <div className={styles.showcaseBadge}>
        <span>IHUB REPAIR SHOWCASE</span>
        <strong>REAL REPAIR · 3D STACK</strong>
      </div>

      <div
        ref={stageRef}
        className={styles.showcaseStage}
        onPointerMove={handlePointerMove}
      >
        <div className={styles.stageGlow} aria-hidden="true" />
        <div className={styles.stageGrid} aria-hidden="true" />
        <div className={styles.stageFloor} aria-hidden="true" />

        {repairCards.map((card, index) => {
          const offset = relativePosition(index, active, repairCards.length);
          const activeCard = offset === 0;
          return (
            <article
              key={card.title}
              className={`${styles.repairCard} ${styles[positionClass(offset)]}`}
              aria-hidden={!activeCard}
            >
              <div className={styles.cardImage}>
                <img src={card.src} alt={`${card.title} at iHub repair lab`} />
                <div className={styles.cardShade} />
                <div className={styles.cardShine} aria-hidden="true" />
              </div>

              <div className={styles.cardContent}>
                <span className={styles.cardEyebrow}>{card.eyebrow}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className={styles.cardChips}>
                  {card.chips.map((chip) => <span key={chip}>{chip}</span>)}
                </div>
                <Link
                  to="/services"
                  className={styles.cardCta}
                  onClick={(event) => event.stopPropagation()}
                >
                  View Services <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className={styles.sideLabel} aria-hidden={activeCard}>
                <span>{card.eyebrow}</span>
                <strong>{card.title}</strong>
              </div>
            </article>
          );
        })}

        <div className={styles.carouselDots} aria-hidden="true">
          {repairCards.map((card, index) => (
            <span
              key={card.title}
              className={index === active ? styles.activeDot : ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.copy}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <span className="tag">Nagercoil · Professional device repair</span>
            </motion.div>

            <motion.h1
              className={styles.h1}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>Broken in.</span>
              <span className="brand-text">Brand-new</span>
              <span>feeling out.</span>
            </motion.h1>

            <motion.p
              className={styles.subtext}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
            >
              iPhone, Android, MacBook, laptop and tablet repair with clear diagnosis,
              transparent approval and convenient mobile-phone pickup & return delivery in
              eligible Nagercoil areas.
            </motion.p>

            <motion.div
              className={styles.deliveryPill}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.42 }}
            >
              <Icon name="truck" size={20} />
              <div>
                <strong>FREE PICKUP + FREE DELIVERY</strong>
                <span>Eligible iPhone & Android repairs</span>
              </div>
            </motion.div>

            <motion.div
              className={styles.btns}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.5 }}
            >
              <Link to="/booking?method=pickup" className="btn-primary brand-grad">
                <Icon name="truck" size={17} />
                Schedule Free Pickup
              </Link>
              <a
                href="https://wa.me/919025790266?text=Hi%2C%20I%20need%20a%20repair%20quote"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                WhatsApp Quote
              </a>
            </motion.div>

            <motion.div
              className={styles.statsRow}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.64 }}
            >
              {proof.map(([icon, label]) => (
                <div className={styles.statItem} key={label}>
                  <Icon name={icon} size={20} />
                  <div className={styles.statLabel}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className={styles.visualWrap}
            initial={{ opacity: 0, scale: 0.96, x: 22 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <StackedRepairShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
