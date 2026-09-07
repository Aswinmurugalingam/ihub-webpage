import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ContactBlock } from '../components/sections/Sections';
import { CONTACT_ITEMS } from '../data/siteData';
import Icon from '../components/ui/Icon';
import styles from './Contact.module.css';

export default function Contact(){
  const location=CONTACT_ITEMS.find(i=>i.label==='Store Location'); const mapSrc='https://www.google.com/maps?q=8.1818771,77.4292565&output=embed';
  return <>
    <section style={{padding:'72px 0 40px',textAlign:'center'}}><div className="container"><motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6}}><span className="tag">Get in touch</span><h1 style={{fontSize:'clamp(2.7rem,5.5vw,5rem)',marginTop:16}}>Contact <span className="brand-text">iHub Nagercoil</span></h1><p style={{maxWidth:600,margin:'16px auto 0',color:'var(--fg2)',lineHeight:1.7}}>Repair quote, booking, pickup-area check, used-phone selling support or store directions. Email: ihubnagercoil@gmail.com</p></motion.div></div></section>
    <section style={{padding:'30px 0 80px'}}><div className="container"><ContactBlock formId="contact-page"/></div></section>
    <section style={{padding:'0 0 80px'}}><div className="container"><div className={styles.locationGrid}><div className={styles.map}><iframe title="iHub Nagercoil shop location on Google Maps" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><div className={styles.mapCard}><div className={styles.mapTitle}>iHub Nagercoil</div><div className={styles.mapAddress}>{location.value}</div><a href={location.href} target="_blank" rel="noopener" className={styles.directions}><Icon name="pin" size={15}/>Get Directions</a></div></div><div className={styles.pickup}><div className={styles.pickupIcon}><Icon name="truck" size={28}/></div><span className="tag" style={{width:'fit-content'}}>Free device pickup</span><h2>Can’t visit the store?</h2><p>Schedule eligible pickup and return delivery for phones, MacBooks, Windows laptops and tablets. Enter the exact address during booking so iHub can confirm coverage.</p><Link to="/pickup-delivery#book-repair" className="btn-primary brand-grad">Schedule Pickup</Link></div></div></div></section>
  </>;
}
