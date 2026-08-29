import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import ScrollReveal from '../components/ui/ScrollReveal';
import styles from './PickupDelivery.module.css';

const steps = [
  ['calendar','Schedule','Choose Free Pickup while booking and select an available pickup window.'],
  ['truck','We collect','Keep the phone ready. Our team coordinates collection from the provided address.'],
  ['search','Diagnosis','The device is inspected and the repair cost is confirmed before approved work starts.'],
  ['tool','Repair & test','The approved repair is completed and the important device functions are quality checked.'],
  ['check','Free return','Once ready, the mobile phone is returned to the confirmed delivery location.'],
];

function DoorstepRouteVisual() {
  return (
    <motion.div
      className={styles.routeStage}
      initial={{ opacity: 0, scale: .95, x: 28 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: .85, delay: .12, ease: [0.22, 1, 0.36, 1] }}
      role="img"
      aria-label="3D doorstep pickup and iHub repair route"
    >
      <div className={styles.routeGrid}/>
      <div className={styles.routeHalo}/>
      <svg className={styles.routeSvg} viewBox="0 0 700 390" preserveAspectRatio="none" aria-hidden="true">
        <path className={styles.routeBase} d="M105 262 C210 106 455 112 590 244" />
        <path className={styles.routeGlowLine} d="M105 262 C210 106 455 112 590 244" />
      </svg>

      <div className={`${styles.routeNode} ${styles.doorNode}`}>
        <div className={styles.routeIcon}><Icon name="pin" size={24}/></div>
        <span>START</span>
        <strong>Your doorstep</strong>
        <small>Scheduled collection</small>
      </div>

      <div className={styles.routeCenter}>
        <div className={styles.pickupBadge}><Icon name="truck" size={22}/><span>₹0 PICKUP</span></div>
        <div className={styles.packageCube} aria-hidden="true">
          <i className={styles.cubeFront}>iHUB</i>
          <i className={styles.cubeTop}/>
          <i className={styles.cubeSide}/>
        </div>
        <div className={styles.centerLabel}>Secure handover</div>
      </div>

      <div className={`${styles.routeNode} ${styles.labNode}`}>
        <div className={styles.routeIcon}><Icon name="tool" size={24}/></div>
        <span>REPAIR LAB</span>
        <strong>iHub Nagercoil</strong>
        <small>Diagnose · Repair · Test</small>
      </div>

      <div className={styles.routeStatus}>
        <span><i/>Collected</span>
        <span><i/>Repaired</span>
        <span><i/>Returned</span>
      </div>
    </motion.div>
  );
}

export default function PickupDelivery() {
  return <>
    <section className={styles.hero}>
      <div className={styles.heroAmbient}/>
      <div className="container">
        <div className={styles.heroGrid}>
          <motion.div className={styles.heroCopy} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
            <span className="tag">Doorstep repair service</span>
            <h1>Free mobile <span className="brand-text">pickup & delivery</span></h1>
            <p>For eligible iPhone and Android phone repairs in Nagercoil service areas. We collect your phone, repair it at iHub, quality-check it and arrange return delivery.</p>
            <div className={styles.actions}>
              <Link to="/booking?method=pickup" className="btn-primary brand-grad">Schedule Free Pickup</Link>
              <a href="https://wa.me/919025790266?text=Hi%2C%20I%20want%20to%20check%20free%20mobile%20pickup%20availability%20in%20my%20area" target="_blank" rel="noopener" className="btn-secondary">Check My Area</a>
            </div>
            <div className={styles.note}><Icon name="shield" size={18}/> Pickup availability is confirmed against the address and service area before collection.</div>
          </motion.div>
          <DoorstepRouteVisual/>
        </div>
      </div>
    </section>

    <section className={styles.process}>
      <div className="container">
        <ScrollReveal><div className="section-header"><span className="tag">Doorstep to doorstep</span><h2>How pickup <span className="brand-text">works</span></h2><p>A clear repair journey from collection to return.</p></div></ScrollReveal>
        <div className={styles.grid}>
          {steps.map(([icon,title,desc],i)=><ScrollReveal key={title} delay={i*.06}><div className={styles.card}><div className={styles.stepNo}>0{i+1}</div><div className={styles.icon}><Icon name={icon}/></div><h3>{title}</h3><p>{desc}</p></div></ScrollReveal>)}
        </div>
      </div>
    </section>

    <section className={styles.coverage}>
      <div className="container">
        <div className={styles.coverageBox}>
          <div><span className="tag">Mobile phones</span><h2>Built for convenient <span className="brand-text">phone repair</span></h2><p>Free pickup and delivery is currently presented for mobile phones. Laptop/tablet transport can be confirmed separately with the store depending on device size and area.</p></div>
          <div className={styles.coverageActions}><Link to="/booking?method=pickup" className="btn-primary brand-grad">Book Pickup</Link><a href="https://wa.me/919025790266?text=Hi%2C%20I%20want%20to%20check%20free%20mobile%20pickup%20availability%20in%20my%20area" target="_blank" rel="noopener" className="btn-secondary">Check My Area</a></div>
        </div>
      </div>
    </section>
  </>;
}
