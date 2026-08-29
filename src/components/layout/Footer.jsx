import { Link } from 'react-router-dom';
import { CONTACT_ITEMS } from '../../data/siteData';
import logoImg from '../../assets/logo.png';
import Icon from '../ui/Icon';
import styles from './Footer.module.css';

export default function Footer(){
  const location=CONTACT_ITEMS.find(i=>i.label==='Store Location'); const phone=CONTACT_ITEMS.find(i=>i.label==='Call Us');
  const mapSrc='https://www.google.com/maps?q=8.1818771,77.4292565&output=embed';
  return <footer className={styles.footer}><div className="container"><div className={styles.grid}>
    <div className={styles.brand}><Link to="/"><img src={logoImg} alt="iHub Nagercoil" className={styles.logoImg}/></Link><p className={styles.brandText}>Professional multi-brand device repair in Nagercoil, with transparent diagnosis, quality-focused repair and convenient mobile pickup & delivery.</p>
    </div>
    <div><div className={styles.colTitle}>Repair</div><ul className={styles.linkList}><li><Link to="/services" className={styles.footLink}>All Services</Link></li><li><Link to="/booking" className={styles.footLink}>Book Repair</Link></li><li><Link to="/pickup-delivery" className={styles.footLink}>Free Mobile Pickup</Link></li></ul></div>
    <div><div className={styles.colTitle}>Company</div><ul className={styles.linkList}><li><Link to="/about" className={styles.footLink}>About iHub</Link></li><li><Link to="/pricing" className={styles.footLink}>Pricing</Link></li><li><Link to="/contact" className={styles.footLink}>Contact</Link></li><li><Link to="/privacy" className={styles.footLink}>Privacy Policy</Link></li><li><Link to="/repair-policy" className={styles.footLink}>Repair & Warranty Policy</Link></li></ul></div>
    <div><div className={styles.colTitle}>Reach Us</div><div className={styles.contactRow}><Icon name="pin" size={18}/><a href={location.href} target="_blank" rel="noopener noreferrer" className={styles.footLink}>{location.value}</a></div><div className={styles.contactRow}><Icon name="phoneCall" size={18}/><a href={phone.href} className={styles.footLink}>{phone.value}</a></div><div className={styles.contactRow}><Icon name="message" size={18}/><a href="https://wa.me/919025790266" target="_blank" rel="noopener noreferrer" className={styles.footLink}>WhatsApp iHub</a></div><div className={styles.contactRow}><Icon name="clock" size={18}/><span style={{color:'var(--fg2)',fontSize:'.875rem'}}>Mon–Sun · 10AM – 9PM</span></div></div>
    <div className={styles.mapCol}><div className={styles.colTitle}>Find Us</div><div className={styles.mapBox}><iframe title="iHub Nagercoil shop location on Google Maps" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><a href={location.href} target="_blank" rel="noopener noreferrer" className={styles.mapPin}><Icon name="pin" size={16}/>Get Directions</a></div></div>
  </div><div className={styles.bottom}><span>© {new Date().getFullYear()} iHub. All rights reserved.</span><span className={styles.devCredit}>Developed by <span>YooNow Technologies</span></span></div></div></footer>;
}
