import Hero from '../components/sections/Hero';
import Brands from '../components/sections/Brands';
import ServicesGrid from '../components/sections/ServicesGrid';
import Gallery from '../components/sections/Gallery';
import Icon from '../components/ui/Icon';
import { Process, WhyUs, PricingSection, Testimonials, CtaBanner, FaqSection } from '../components/sections/Sections';
import ScrollReveal from '../components/ui/ScrollReveal';
import { Link } from 'react-router-dom';
import stackImg from '../assets/gallery4.jpg';
import phoneImg from '../assets/hero-iphone.jpg';
import styles from './Home.module.css';

export default function Home(){return <>
  <Hero/>
  <Brands/>
  <section style={{padding:'72px 0'}}><div className="container"><ScrollReveal><div className="section-header"><span className="tag">What we repair</span><h2 style={{marginTop:14}}>One hub for <span className="brand-text">every repair</span></h2><p>From screens and batteries to liquid damage, data recovery and board-level diagnosis.</p></div></ScrollReveal><ServicesGrid limit={8} showViewAll/></div></section>
  <section style={{padding:'0 0 60px'}}><div className="container"><ScrollReveal><div className={styles.pickup}><div><span className="tag">Free device pickup</span><h2>We pick it up. <span className="brand-text">We bring it back.</span></h2><p>For eligible iPhone, Android, MacBook, Windows laptop and tablet repairs in supported Nagercoil areas. Schedule a doorstep collection directly from the Free Pickup page.</p></div><Link to="/pickup-delivery#book-repair" className="btn-primary brand-grad"><Icon name="truck" size={18}/>Schedule Pickup</Link></div></ScrollReveal></div></section>
  <Process/>
  <Gallery/>
  <WhyUs/>
  <PricingSection/>
  <Testimonials/>
  <section className={styles.sellSec}><div className="container"><ScrollReveal><div className={styles.sellPanel}>
    <div className={styles.sellVisual} aria-hidden="true"><div className={styles.sellGlow}/><div className={`${styles.sellPhone} ${styles.sellBack}`}><img src={stackImg} alt="" width="800" height="800" loading="lazy" decoding="async"/></div><div className={`${styles.sellPhone} ${styles.sellFront}`}><img src={phoneImg} alt="" width="768" height="1024" loading="lazy" decoding="async"/></div><div className={styles.sellBadge}><Icon name="wallet" size={18}/><span>SELL TO IHUB</span></div></div>
    <div className={styles.sellCopy}><span className="tag">Sell your used phone</span><h2>Old phone? <span className="brand-text">Turn it into value.</span></h2><p>Submit your iPhone or Android model, condition and clear photos. iHub reviews the request and contacts you with an offer before store handover or eligible pickup.</p><div className={styles.sellPoints}><span><Icon name="camera" size={16}/>Photo review</span><span><Icon name="shield" size={16}/>Ownership check</span><span><Icon name="wallet" size={16}/>Final value after inspection</span></div><div className={styles.sellActions}><Link to="/sell-phone" className="btn-primary brand-grad"><Icon name="phone" size={17}/>Sell My Phone</Link><a href="https://wa.me/919025790266?text=Hi%20iHub%2C%20I%20want%20to%20sell%20my%20used%20phone" target="_blank" rel="noopener noreferrer" className="btn-secondary"><Icon name="message" size={17}/>WhatsApp</a></div></div>
  </div></ScrollReveal></div></section>
  <FaqSection/>
  <section style={{padding:'56px 0'}}><div className="container"><CtaBanner title={<>Device acting up? <span className="brand-text">Start the repair journey.</span></>} sub="Book a repair, schedule eligible free pickup for supported devices, or contact iHub on WhatsApp." btn1Text="Schedule Free Pickup" btn1Link="/pickup-delivery#book-repair" btn2Text="WhatsApp iHub" btn2Link="https://wa.me/919025790266?text=Hi%2C%20I%20need%20a%20repair%20quote"/></div></section>
</>}
