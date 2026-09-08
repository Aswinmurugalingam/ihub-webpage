import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/logo.png';
import Icon from '../ui/Icon';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label:'Home', to:'/' },
  { label:'Services', to:'/services' },
  { label:'Free Pickup', to:'/pickup-delivery', accent:true },
  { label:'Sell Phone', to:'/sell-phone' },
  { label:'About', to:'/about' },
  { label:'Contact', to:'/contact' },
];

export default function Navbar(){
  const [scrolled,setScrolled]=useState(false); const [menuOpen,setMenuOpen]=useState(false); const location=useLocation();
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>8);window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);
  useEffect(()=>setMenuOpen(false),[location.pathname,location.hash]);
  const active=(to)=>to==='/'?location.pathname==='/':location.pathname.startsWith(to);
  return <>
    <header className={`${styles.navbar} ${scrolled?styles.scrolled:''}`}><div className={`container ${styles.inner}`}>
      <Link to="/" className={styles.logo}><img src={logoImg} alt="iHub Nagercoil" className={styles.logoImg} width="600" height="229" fetchPriority="high" decoding="async"/></Link>
      <nav className={styles.links}>{NAV_LINKS.map(l=><Link key={l.to} to={l.to} className={`${styles.link} ${active(l.to)?styles.active:''} ${l.accent?styles.accentLink:''}`}>{l.label}</Link>)}</nav>
      <Link to="/pickup-delivery#book-repair" className={`${styles.cta} brand-grad`}><Icon name="calendar" size={16}/>Book Repair</Link>
      <button className={styles.hamburger} onClick={()=>setMenuOpen(v=>!v)} aria-label="Open navigation" aria-expanded={menuOpen}><span className={menuOpen?styles.barOpen:''}/><span className={menuOpen?styles.barOpen:''}/><span className={menuOpen?styles.barOpen:''}/></button>
    </div></header>
    <AnimatePresence>{menuOpen&&<motion.div key="mobile-menu" initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} transition={{duration:.25}} className={styles.mobileMenu}>
      {NAV_LINKS.map(l=><Link key={l.to} to={l.to} className={`${styles.mobileLink} ${active(l.to)?styles.active:''}`}>{l.accent&&<Icon name="truck" size={17}/>} {l.label}</Link>)}
      <Link to="/pickup-delivery#book-repair" className={`${styles.mobileCta} brand-grad`}><Icon name="calendar" size={18}/>Book Repair</Link>
    </motion.div>}</AnimatePresence>
  </>;
}
