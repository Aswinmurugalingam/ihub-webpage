import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './DeviceScene.module.css';

const partNames = ['screen','camera','battery','board','port'];

export default function DeviceScene({ compact = false, exploded = false, highlight = '', label = 'iHub device visualizer' }) {
  const stageRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const onMove = (e) => {
    if (reduceMotion || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    stageRef.current.style.setProperty('--rx', `${-y * 10}deg`);
    stageRef.current.style.setProperty('--ry', `${x * 16}deg`);
    stageRef.current.style.setProperty('--mx', `${(x + .5) * 100}%`);
    stageRef.current.style.setProperty('--my', `${(y + .5) * 100}%`);
  };

  const onLeave = () => {
    if (!stageRef.current) return;
    stageRef.current.style.setProperty('--rx', '-5deg');
    stageRef.current.style.setProperty('--ry', '12deg');
    stageRef.current.style.setProperty('--mx', '66%');
    stageRef.current.style.setProperty('--my', '34%');
  };

  return (
    <div
      ref={stageRef}
      className={`${styles.stage} ${compact ? styles.compact : ''} ${exploded ? styles.exploded : ''}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      role="img"
      aria-label={label}
    >
      <div className={styles.grid} />
      <div className={styles.halo} />
      <motion.div
        className={styles.phone}
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={`${styles.part} ${styles.back}`} />
        <div className={`${styles.part} ${styles.board} ${highlight === 'board' ? styles.active : ''}`}>
          <span className={styles.chipA}/><span className={styles.chipB}/><span className={styles.chipC}/>
          <span className={styles.traceA}/><span className={styles.traceB}/>
        </div>
        <div className={`${styles.part} ${styles.battery} ${highlight === 'battery' ? styles.active : ''}`}>
          <span>iHub</span><small>POWER CELL</small>
        </div>
        <div className={`${styles.part} ${styles.camera} ${highlight === 'camera' ? styles.active : ''}`}>
          <i/><i/><i/>
        </div>
        <div className={`${styles.part} ${styles.port} ${highlight === 'port' ? styles.active : ''}`} />
        <div className={`${styles.part} ${styles.screen} ${highlight === 'screen' ? styles.active : ''}`}>
          <div className={styles.dynamicIsland}/>
          <div className={styles.screenGlow}/>
          <div className={styles.screenText}>
            <strong>iHUB</strong>
            <span>REPAIR LAB</span>
          </div>
          <div className={styles.crack}/>
        </div>
        <div className={styles.frame} />
      </motion.div>
      <div className={styles.floorShadow}/>
      {!compact && (
        <div className={styles.labels}>
          {partNames.map((p, i) => <span key={p} className={`${highlight === p ? styles.labelActive : ''} ${styles[`label${i}`]}`}>{p}</span>)}
        </div>
      )}
    </div>
  );
}
