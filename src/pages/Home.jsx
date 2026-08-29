import Hero from '../components/sections/Hero';
import Brands from '../components/sections/Brands';
import ServicesGrid from '../components/sections/ServicesGrid';
import Gallery from '../components/sections/Gallery';
import Icon from '../components/ui/Icon';
import { Process, WhyUs, PricingSection, Testimonials, CtaBanner, ContactBlock, FaqSection } from '../components/sections/Sections';
import ScrollReveal from '../components/ui/ScrollReveal';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home(){return <>
  <Hero/>
  <Brands/>
  <section style={{padding:'72px 0'}}><div className="container"><ScrollReveal><div className="section-header"><span className="tag">What we repair</span><h2 style={{marginTop:14}}>One hub for <span className="brand-text">every repair</span></h2><p>From screens and batteries to liquid damage, data recovery and board-level diagnosis.</p></div></ScrollReveal><ServicesGrid limit={8} showViewAll/></div></section>
  <section style={{padding:'0 0 60px'}}><div className="container"><ScrollReveal><div className={styles.pickup}><div><span className="tag">Free mobile pickup</span><h2>We pick it up. <span className="brand-text">We bring it back.</span></h2><p>For eligible iPhone and Android repairs in supported Nagercoil areas. Schedule a doorstep collection directly from the booking flow.</p></div><Link to="/booking?method=pickup" className="btn-primary brand-grad"><Icon name="truck" size={18}/>Schedule Pickup</Link></div></ScrollReveal></div></section>
  <Process/>
  <Gallery/>
  <WhyUs/>
  <PricingSection/>
  <Testimonials/>
  <FaqSection/>
  <section style={{padding:'56px 0'}}><div className="container"><CtaBanner title={<>Device acting up? <span className="brand-text">Start the repair journey.</span></>} sub="Book in-store, schedule eligible free mobile pickup, or contact iHub on WhatsApp." btn1Text="Schedule Free Pickup" btn1Link="/booking?method=pickup" btn2Text="WhatsApp iHub" btn2Link="https://wa.me/919025790266?text=Hi%2C%20I%20need%20a%20repair%20quote"/></div></section>
  <section style={{padding:'72px 0'}}><div className="container"><ContactBlock formId="home"/></div></section>
</>}
