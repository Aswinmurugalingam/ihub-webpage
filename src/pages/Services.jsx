import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ServicesGrid from '../components/sections/ServicesGrid';
import { CtaBanner } from '../components/sections/Sections';
import ScrollReveal from '../components/ui/ScrollReveal';
import Icon from '../components/ui/Icon';
import styles from './Services.module.css';

const servicePods = [
  ['display', 'Display'],
  ['battery', 'Battery'],
  ['camera', 'Camera'],
  ['chip', 'Board'],
];

function RepairLabDeck() {
  return (
    <motion.div
      className={styles.labStage}
      initial={{ opacity: 0, scale: .94, x: 28 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: .85, delay: .12, ease: [0.22, 1, 0.36, 1] }}
      role="img"
      aria-label="3D iHub multi-device repair service deck"
    >
      <div className={styles.labGlow} />
      <div className={styles.labGrid} />
      <div className={styles.labRingA} />
      <div className={styles.labRingB} />
      <div className={styles.labFloor} />

      <motion.div
        className={styles.laptopDevice}
        animate={{ y: [0, -7, 0], rotateZ: [-4, -3, -4] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={styles.laptopScreen}>
          <span>MACBOOK / LAPTOP</span>
          <strong>BOARD + DISPLAY</strong>
          <div className={styles.scanLine} />
        </div>
        <div className={styles.laptopBase} />
      </motion.div>

      <motion.div
        className={styles.tabletDevice}
        animate={{ y: [5, -5, 5], rotateZ: [6, 5, 6] }}
        transition={{ duration: 6.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={styles.tabletCamera} />
        <Icon name="tablet" size={42} />
        <span>TABLET CARE</span>
      </motion.div>

      <motion.div
        className={styles.phoneDevice}
        animate={{ y: [-8, 8, -8], rotateY: [-4, 4, -4] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={styles.phoneNotch} />
        <div className={styles.phoneDisplay}>
          <div className={styles.phoneLogo}>iHUB</div>
          <span>REPAIR LAB</span>
        </div>
        <div className={styles.phoneGlow} />
      </motion.div>

      <div className={styles.labCore}>
        <span>08 SERVICE CATEGORIES</span>
        <strong>ONE REPAIR LAB</strong>
        <small>Tap a service below for full details</small>
      </div>

      {servicePods.map(([icon, label], index) => (
        <motion.div
          key={label}
          className={`${styles.servicePod} ${styles[`pod${index}`]}`}
          animate={{ y: index % 2 ? [6, -6, 6] : [-6, 6, -6] }}
          transition={{ duration: 4.8 + index * .45, repeat: Infinity, ease: 'easeInOut', delay: index * .18 }}
        >
          <div className={styles.podIcon}><Icon name={icon} size={18}/></div>
          <div><span>REPAIR</span><strong>{label}</strong></div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function Services(){return <>
  <section className={styles.hero}>
    <div className={styles.heroGlow}/>
    <div className="container">
      <div className={styles.heroGrid}>
        <motion.div className={styles.heroCopy} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
          <span className="tag">iHub repair services</span>
          <h1>One lab for <span className="brand-text">every repair.</span></h1>
          <p>From cracked displays and worn batteries to liquid damage, data recovery and board-level faults — choose a service and see the full repair details instantly without leaving this page.</p>
          <div className={styles.heroActions}>
            <Link to="/pickup-delivery#book-repair" className="btn-primary brand-grad">Book Repair</Link>
            <Link to="/pickup-delivery" className="btn-secondary">Free Mobile Pickup</Link>
          </div>
          <div className={styles.heroProof}>
            <span><Icon name="search" size={15}/>Diagnosis first</span>
            <span><Icon name="check" size={15}/>Quality checked</span>
            <span><Icon name="tool" size={15}/>Multi-brand</span>
          </div>
        </motion.div>
        <RepairLabDeck/>
      </div>
    </div>
  </section>

  <section className={styles.serviceListSec}><div className="container"><ScrollReveal><div className="section-header"><span className="tag">Choose a category</span><h2 style={{marginTop:14}}>Explore the <span className="brand-text">repair lab</span></h2><p>Tap any service card to open its complete repair details here. No separate service page is required.</p></div></ScrollReveal><ServicesGrid/></div></section>
  <section className={styles.ctaSec}><div className="container"><CtaBanner title={<>Need your phone collected? <span className="brand-text">We come to you.</span></>} sub="Free pickup and return delivery is available for eligible phones, MacBooks, Windows laptops and tablets in supported Nagercoil areas." btn1Text="Schedule Free Pickup" btn1Link="/pickup-delivery#book-repair" btn2Text="WhatsApp iHub" btn2Link="https://wa.me/919025790266?text=Hi%2C%20I%20need%20help%20choosing%20a%20repair%20service"/></div></section>
</>}
