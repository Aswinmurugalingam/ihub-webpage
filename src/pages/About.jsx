import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ABOUT_VALUES, ABOUT_MILESTONES } from '../data/siteData';
import ScrollReveal from '../components/ui/ScrollReveal';
import { CtaBanner } from '../components/sections/Sections';
import DeviceScene from '../components/3d/DeviceScene';
import Icon from '../components/ui/Icon';
import workshopImg from '../assets/hero-tech.jpg';
import styles from './About.module.css';

const coreNodes = [
  ['search', '01', 'Diagnose', 'Find the real fault'],
  ['message', '02', 'Approve', 'Confirm before work'],
  ['tool', '03', 'Repair', 'Careful technical work'],
  ['check', '04', 'Test', 'Quality before handover'],
];

function RepairCore3D() {
  const stageRef = useRef(null);

  const handlePointerMove = (event) => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia('(pointer: coarse)').matches) return;

    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    stage.style.setProperty('--rx', `${((0.5 - y) * 5).toFixed(2)}deg`);
    stage.style.setProperty('--ry', `${((x - 0.5) * 7).toFixed(2)}deg`);
    stage.style.setProperty('--px', `${((x - 0.5) * 16).toFixed(1)}px`);
    stage.style.setProperty('--py', `${((y - 0.5) * 12).toFixed(1)}px`);
  };

  const handlePointerLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty('--rx', '0deg');
    stage.style.setProperty('--ry', '0deg');
    stage.style.setProperty('--px', '0px');
    stage.style.setProperty('--py', '0px');
  };

  return (
    <motion.div
      className={styles.coreShell}
      initial={{ opacity: 0, scale: .96, x: 24 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: .85, delay: .12, ease: [.22, 1, .36, 1] }}
    >
      <div className={styles.coreHeader}>
        <div>
          <span>IHUB REPAIR CORE</span>
          <strong>One controlled repair process</strong>
        </div>
        <div className={styles.livePill}><i /> NAGERCOIL LAB</div>
      </div>

      <div
        ref={stageRef}
        className={styles.coreStage}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className={styles.coreGrid} aria-hidden="true" />
        <div className={styles.coreGlow} aria-hidden="true" />
        <div className={styles.ringOuter} aria-hidden="true" />
        <div className={styles.ringMiddle} aria-hidden="true" />
        <div className={styles.ringInner} aria-hidden="true" />
        <div className={styles.scanBeam} aria-hidden="true" />

        <div className={styles.coreDeviceAnchor}>
          <motion.div
            className={styles.coreDevice}
            animate={{ y: [-7, 7], rotateZ: [-1, 1] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          >
          <div className={styles.deviceFrame}>
            <div className={styles.deviceSpeaker} />
            <div className={styles.deviceScreen}>
              <img src={workshopImg} alt="iHub professional repair workshop" />
              <div className={styles.deviceShade} />
              <div className={styles.deviceSweep} aria-hidden="true" />
              <div className={styles.deviceCopy}>
                <span>IHUB STANDARD</span>
                <strong>Clear diagnosis.<br />Careful repair.</strong>
              </div>
            </div>
          </div>
          <div className={styles.coreBase}>
            <i />
            <span>QUALITY CONTROL ACTIVE</span>
          </div>
          </motion.div>
        </div>

        <div className={styles.nodeGrid}>
          {coreNodes.map(([icon, number, title, text], index) => (
            <motion.article
              key={title}
              className={`${styles.coreNode} ${styles[`node${index + 1}`]}`}
              animate={{ y: index % 2 === 0 ? [-4, 4] : [4, -4] }}
              transition={{
                duration: 4.8 + index * .35,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }}
            >
              <div className={styles.nodeIcon}><Icon name={icon} size={17} /></div>
              <div className={styles.nodeCopy}>
                <span>{number}</span>
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
            </motion.article>
          ))}
        </div>

        <div className={styles.coreStatus}>
          <div><Icon name="phone" size={16} /><span>Phones</span></div>
          <div><Icon name="laptop" size={16} /><span>MacBook & Laptop</span></div>
          <div><Icon name="tablet" size={16} /><span>Tablet</span></div>
          <strong>Multi-brand care</strong>
        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 72%', 'end 42%'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return <>
    <section className={styles.pageHero}>
      <div className={styles.heroBg} /><div className={styles.heroDots} /><div className={styles.heroGlow} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.heroGrid}>
          <motion.div className={styles.heroCopy} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
            <span className="tag">About iHub</span>
            <h1>Repair with the <span className="brand-text">right process.</span></h1>
            <p>Multi-brand device repair in Nagercoil focused on clear diagnosis, customer approval, careful repair and quality-check before handover.</p>
            <div className={styles.heroActions}><button onClick={() => navigate('/pickup-delivery#book-repair')} className="btn-primary brand-grad">Book Repair</button><button onClick={() => navigate('/pickup-delivery')} className="btn-secondary">Free Pickup & Delivery</button></div>
          </motion.div>
          <RepairCore3D />
        </div>
      </div>
    </section>

    <section className={styles.storySec}><div className="container"><div className={styles.storyGrid}><ScrollReveal direction="left"><DeviceScene exploded label="iHub device repair process visual" /></ScrollReveal><ScrollReveal direction="right"><span className="tag">How we work</span><h2>Complex repair. <span className="brand-text">Simple communication.</span></h2><p>From a cracked display to a board-level fault, the customer experience should stay clear: inspect the device, explain the likely issue, confirm the estimate, complete the approved repair and test the relevant functions before return.</p><p>iHub supports phones, tablets, MacBooks and Windows laptops, including screen, battery, charging, liquid-damage, data-recovery and board-level work depending on model and parts availability.</p><p>For eligible supported-device repairs, the website also supports free pickup and return delivery for a more convenient repair experience.</p><div className={styles.storyBtns}><button onClick={() => navigate('/pickup-delivery#book-repair')} className="btn-primary brand-grad">Book Repair</button><button onClick={() => navigate('/pickup-delivery')} className="btn-secondary">Pickup & Delivery</button></div></ScrollReveal></div></div></section>

    <section className={styles.valuesSec}><div className="container"><ScrollReveal><div className="section-header"><span className="tag">Service principles</span><h2 style={{ marginTop: 14 }}>What guides the <span className="brand-text">repair experience</span></h2></div></ScrollReveal><div className={styles.valuesGrid}>{ABOUT_VALUES.map((v, i) => <ScrollReveal key={v.title} delay={i * .05}><div className={styles.valueCard}><div className={styles.valueIcon}><Icon name={v.icon} /></div><div className={styles.valueTitle}>{v.title}</div><p className={styles.valueDesc}>{v.desc}</p></div></ScrollReveal>)}</div></div></section>

    <section className={styles.processSec}><div className="container"><ScrollReveal><div className="section-header"><span className="tag">Repair standard</span><h2 style={{ marginTop: 14 }}>From inspection to <span className="brand-text">handover</span></h2><p>This process replaces unverified milestone/award claims with the actual customer repair flow.</p></div></ScrollReveal><div ref={ref} className={styles.milestoneList}><div className={styles.milestoneRail}><motion.div className={styles.milestoneRailFill} style={{ scaleY: scale }} /></div>{ABOUT_MILESTONES.map((m, i) => <ScrollReveal key={i} delay={i * .07}><div className={styles.milestone}><div className={styles.mDot}><Icon name={m.icon} size={18} /></div><div className={styles.mBody}><div className={styles.mYear}>{m.year}</div><div className={styles.mTitle}>{m.title}</div><div className={styles.mDesc}>{m.desc}</div></div></div></ScrollReveal>)}</div></div></section>

    <section className={styles.ctaSec}><div className="container"><CtaBanner title={<>Start with a clear <span className="brand-text">diagnosis.</span></>} sub="Book a store appointment or request free pickup & delivery for an eligible supported-device repair." btn1Text="Schedule Free Pickup" btn1Link="/pickup-delivery#book-repair" btn2Text="Book Repair" btn2Link="/pickup-delivery#book-repair" /></div></section>
  </>;
}
