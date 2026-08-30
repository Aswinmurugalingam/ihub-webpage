import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PRICING, WHY_US, CONTACT_ITEMS } from '../../data/siteData';
import TiltCard from '../ui/TiltCard';
import ScrollReveal from '../ui/ScrollReveal';
import Icon from '../ui/Icon';
import DeviceScene from '../3d/DeviceScene';
import { createEnquiry } from '../../services/backend';
import styles from './Sections.module.css';

/* ─── SCROLL-DRIVEN REPAIR JOURNEY ─── */
export function Process() {
  const steps = [
    { icon:'truck', title:'Pickup / Visit', desc:'Choose a store appointment or eligible free device pickup.' },
    { icon:'search', title:'Diagnose', desc:'We inspect the symptoms and confirm the repair route and estimate.' },
    { icon:'tool', title:'Repair', desc:'Approved work is completed with the appropriate tools and part option.' },
    { icon:'check', title:'Quality Check', desc:'Relevant charging, display, audio, camera and network functions are tested.' },
    { icon:'truck', title:'Return', desc:'Collect at iHub or receive the repaired mobile back through eligible delivery.' },
  ];
  return <section className={styles.journeySec}><div className="container">
    <ScrollReveal><div className="section-header"><span className="tag">Doorstep to doorstep</span><h2>One repair. <span className="brand-text">One clear journey.</span></h2><p>Follow the flow from pickup or check-in through diagnosis, repair, quality check and handover.</p></div></ScrollReveal>
    <div className={styles.journeyTrack}>
      <div className={styles.journeyGrid}>{steps.map((s,i)=><ScrollReveal key={s.title} delay={i*.06}><div className={styles.journeyStep}><div className={styles.journeyIcon}><Icon name={s.icon}/></div><span>0{i+1}</span><h3>{s.title}</h3><p>{s.desc}</p></div></ScrollReveal>)}</div>
    </div>
    <div className={styles.journeyCta}><Link to="/pickup-delivery" className="btn-primary brand-grad"><Icon name="truck" size={17}/>Free Pickup & Delivery</Link><a href="https://wa.me/919025790266?text=Hi%2C%20I%20need%20help%20with%20a%20repair" target="_blank" rel="noopener" className="btn-secondary"><Icon name="message" size={17}/>WhatsApp iHub</a></div>
  </div></section>;
}

export function WhyUs() {
  return <section className={styles.padSec}><div className="container">
    <div className={styles.whyTop}><ScrollReveal direction="left"><div><span className="tag">Why iHub</span><h2 style={{marginTop:14}}>Repair with <span className="brand-text">clarity & control</span></h2></div></ScrollReveal><ScrollReveal direction="right"><p style={{color:'var(--fg2)',lineHeight:1.7}}>Clear diagnosis, repair approval before work, quality-focused parts, device testing and convenient support from check-in to handover.</p></ScrollReveal></div>
    <div className={styles.whyGrid}>{WHY_US.map((w,i)=><TiltCard key={i} className={styles.whyCard} intensity={7}><div className={styles.whyIcon}><Icon name={w.icon}/></div><h3 className={styles.whyTitle}>{w.title}</h3><p className={styles.whyDesc}>{w.desc}</p></TiltCard>)}</div>
  </div></section>;
}

export function PricingSection({ showTitle=true }) {
  const navigate=useNavigate(); const featured=PRICING.find(i=>i.featured); const standard=PRICING.filter(i=>!i.featured); const ordered=featured&&standard.length>=2?[standard[0],featured,...standard.slice(1)]:PRICING;
  return <section className={styles.altSec}><div className="container">
    {showTitle&&<ScrollReveal><div className="section-header"><span className="tag">Indicative pricing</span><h2 style={{marginTop:14}}>Know the range <span className="brand-text">before approval</span></h2><p>Website prices are starting estimates. Device model, part option and actual fault determine the final quote.</p></div></ScrollReveal>}
    <div className={styles.pricingGrid}>{ordered.map((p,i)=><ScrollReveal key={p.name} delay={i*.08}><div className={`${styles.priceCard} ${p.featured?styles.priceCardFeatured:''}`}>{p.featured&&<span className={`${styles.priceBadge} brand-grad`}>Popular</span>}<div className={styles.priceName}>{p.name}</div><div className={styles.priceFrom}>Indicative from</div><div className={styles.priceAmount}>{p.from}</div><ul className={styles.priceFeats}>{p.points.map(x=><li key={x}>{x}</li>)}</ul><button className={`${styles.priceBtn} brand-grad`} onClick={()=>navigate('/pickup-delivery#book-repair')}>Book This Repair</button></div></ScrollReveal>)}</div>
    <p className={styles.priceNote}>Final price and warranty are confirmed after diagnosis and before repair approval.</p>
  </div></section>;
}

/* Kept under the existing export name so Home does not need compatibility work. */
export function Testimonials() {
  const standards=[
    ['search','Diagnosis before repair','Understand the likely fault, route and expected cost before approving work.'],
    ['wallet','Transparent approval','The repair cost is confirmed after diagnosis and before approved work begins.'],
    ['shield','Repair-specific warranty','Warranty duration and coverage are stated for the repair/part option selected.'],
    ['message','Clear communication','Booking and pickup details keep the repair handover simple and clear.'],
    ['tool','Function testing','Relevant functions are checked after repair before the device is marked ready.'],
    ['truck','Convenient mobile service','Eligible phones, MacBooks, Windows laptops and tablets can request free pickup and return delivery.'],
  ];
  return <section className={styles.padSec}><div className="container"><ScrollReveal><div className="section-header"><span className="tag">Service standard</span><h2 style={{marginTop:14}}>What to expect from <span className="brand-text">iHub</span></h2><p>Professional repair is more than replacing a part. The process should be clear before, during and after the job.</p></div></ScrollReveal><div className={styles.expectGrid}>{standards.map(([icon,title,desc],i)=><ScrollReveal key={title} delay={i*.05}><div className={styles.expectCard}><div className={styles.expectIcon}><Icon name={icon}/></div><h3>{title}</h3><p>{desc}</p></div></ScrollReveal>)}</div></div></section>;
}

export function CtaBanner({ title, sub, btn1Text, btn1Link, btn2Text, btn2Link }) {
  const navigate=useNavigate(); const external=(v)=>v?.startsWith('http')||v?.startsWith('tel:')||v?.startsWith('mailto:');
  return <ScrollReveal><div className={styles.cta}><div className={styles.ctaGrid}/><div className={styles.ctaGlow}/><h2 className={styles.ctaTitle}>{title}</h2><p className={styles.ctaSub}>{sub}</p><div className={styles.ctaBtns}>{external(btn1Link)?<a href={btn1Link} className="btn-primary brand-grad" target={btn1Link?.startsWith('http')?'_blank':undefined} rel="noopener">{btn1Text}</a>:<button onClick={()=>btn1Link&&navigate(btn1Link)} className="btn-primary brand-grad">{btn1Text}</button>}{btn2Text&&(external(btn2Link)?<a href={btn2Link} target={btn2Link?.startsWith('http')?'_blank':undefined} rel="noopener" className="btn-secondary">{btn2Text}</a>:<button onClick={()=>btn2Link&&navigate(btn2Link)} className="btn-secondary">{btn2Text}</button>)}</div></div></ScrollReveal>;
}

export function ContactBlock({ formId='main' }) {
  const [status,setStatus]=useState('idle'); const [reference,setReference]=useState('');
  const handleSubmit=async(e)=>{e.preventDefault();setStatus('sending');const fd=new FormData(e.currentTarget);const payload={name:fd.get('name'),phone:fd.get('phone'),email:fd.get('email')||'',device:fd.get('device'),service:fd.get('service'),description:fd.get('description')};try{const result=await createEnquiry(payload);setReference(result.reference||'');setStatus('success')}catch{setStatus('error')}};
  return <div className={styles.contactGrid}>
    <ScrollReveal direction="left"><div><span className="tag">Contact iHub</span><h2 style={{fontSize:'clamp(2rem,4vw,3.4rem)',margin:'16px 0 20px'}}>Talk to a <span className="brand-text">repair specialist</span></h2><p style={{color:'var(--fg2)',lineHeight:1.7,marginBottom:30}}>Get a quote, ask about pickup coverage, book a repair or visit the Nagercoil store.</p><div className={styles.contactItems}>{CONTACT_ITEMS.map((c,i)=>{const inner=<><div className={styles.cIcon}><Icon name={c.icon}/></div><div><div className={styles.cLabel}>{c.label}</div><div className={styles.cValue}>{c.value}</div></div></>;return c.href?<motion.a key={i} href={c.href} target={c.external?'_blank':undefined} rel={c.external?'noopener noreferrer':undefined} className={styles.contactItem} whileHover={{x:7,scale:1.01}}>{inner}</motion.a>:<div key={i} className={styles.contactItem}>{inner}</div>})}</div><div className={styles.pickupMini}><Icon name="truck"/><div><strong>Need doorstep service?</strong><span>Free pickup & delivery for eligible mobile repairs.</span></div><Link to="/pickup-delivery">View details →</Link></div></div></ScrollReveal>
    <ScrollReveal delay={.12} direction="right"><div className={styles.formBox}><h3 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',marginBottom:6}}>Get a repair quote</h3><p style={{fontSize:'.875rem',color:'var(--fg2)',marginBottom:28}}>Send your device details. iHub can follow up by phone or WhatsApp.</p>{status==='success'?<div className={styles.formSuccess}><Icon name="check" size={32}/><strong>Request received</strong><span>{reference?`Reference: ${reference}`:'Your request has been saved.'}</span><a href="https://wa.me/919025790266?text=Hi%2C%20I%20just%20sent%20a%20repair%20quote%20request" target="_blank" rel="noopener" className="btn-secondary">Continue on WhatsApp</a></div>:<form onSubmit={handleSubmit}>
      <div className={styles.formTwo}><div className={styles.field}><label htmlFor={`${formId}-name`}>Full Name</label><input id={`${formId}-name`} name="name" placeholder="Your name" required/></div><div className={styles.field}><label htmlFor={`${formId}-phone`}>Phone / WhatsApp</label><input id={`${formId}-phone`} name="phone" type="tel" inputMode="tel" placeholder="+91 9XXXXXXXXX" required/></div></div>
      <div className={styles.field}><label htmlFor={`${formId}-email`}>Email (optional)</label><input id={`${formId}-email`} name="email" type="email" placeholder="you@example.com"/></div>
      <div className={styles.field}><label htmlFor={`${formId}-device`}>Device & Model</label><input id={`${formId}-device`} name="device" placeholder="e.g. iPhone 15 Pro / Galaxy S24" required/></div>
      <div className={styles.field}><label htmlFor={`${formId}-service`}>Service Needed</label><select id={`${formId}-service`} name="service" required defaultValue=""><option value="" disabled>Select a service...</option>{['Screen Replacement','Battery Replacement','Water Damage','Motherboard / Chip-Level','Data Recovery','Software / Other'].map(o=><option key={o}>{o}</option>)}</select></div>
      <div className={styles.field}><label htmlFor={`${formId}-desc`}>Describe the Issue</label><textarea id={`${formId}-desc`} name="description" placeholder="What is happening with the device?" required/></div>
      {status==='error'&&<p className={styles.formError}>Could not submit right now. Please call or WhatsApp iHub.</p>}
      <button type="submit" className={`${styles.formSubmit} brand-grad`} disabled={status==='sending'}>{status==='sending'?'Sending…':'Request Callback →'}</button>
    </form>}</div></ScrollReveal>
  </div>;
}

const FAQ_ITEMS=[
  {q:'What type of replacement parts do you use?',a:'Part options vary by device and availability. iHub should explain the available grade, price and warranty before you approve the repair. If you require a specific original/service-pack option, ask the store to confirm availability before booking.'},
  {q:'How long does a repair take?',a:'Common screen, battery and charging repairs may be completed the same day when parts are available. Board-level, liquid-damage and data-recovery work can take longer. A realistic turnaround is confirmed after diagnosis.'},
  {q:'How is diagnosis handled?',a:'The device is assessed before repair approval. If any diagnostic or data-recovery charge applies to a particular job, iHub should disclose it before chargeable work begins.'},
  {q:'How does repair warranty work?',a:'Warranty depends on the repair and part option selected. The confirmed invoice/job sheet should state the exact duration and coverage. New physical damage, liquid damage or unrelated faults are normally outside the replaced-part warranty.'},
  {q:'Can you recover data from a dead phone?',a:'Data recovery may be possible depending on the type of damage and storage condition, but recovery cannot be guaranteed. The device should be assessed before any recovery promise is made.'},
  {q:'Do you offer free pickup and delivery?',a:'Yes — the website supports free pickup and return delivery for eligible supported-device repairs in supported Nagercoil areas. Availability is confirmed against the address and pickup window before collection.'},
  {q:'How is my device data handled?',a:'Hardware repair should not require browsing personal files. Back up important data where possible. If software, data-recovery or testing work requires device access, the scope should be agreed before work begins.'},
];

export function FaqSection(){const[open,setOpen]=useState(null);return <section className={styles.altSec}><div className="container"><ScrollReveal><div className="section-header"><span className="tag">FAQ</span><h2 style={{marginTop:14}}>Before you <span className="brand-text">book</span></h2><p>Clear answers about estimates, parts, warranty, data and doorstep service.</p></div></ScrollReveal><div className={styles.faqList}>{FAQ_ITEMS.map((item,i)=><ScrollReveal key={i} delay={i*.035}><div className={`${styles.faqItem} ${open===i?styles.faqOpen:''}`} onClick={()=>setOpen(open===i?null:i)}><div className={styles.faqQ}><span>{item.q}</span><span className={styles.faqChevron}>{open===i?'−':'+'}</span></div><AnimatePresence>{open===i&&<motion.div className={styles.faqA} initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:.24}}>{item.a}</motion.div>}</AnimatePresence></div></ScrollReveal>)}</div></div></section>}

export function GoogleRatingBadge(){return null;}

export function MobileStickyBar(){const[visible,setVisible]=useState(false);const navigate=useNavigate();useEffect(()=>{const onScroll=()=>setVisible(window.scrollY>320);window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);return <AnimatePresence>{visible&&<motion.div className={styles.stickyBar} initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}} transition={{type:'spring',stiffness:300,damping:30}}><button className={`${styles.stickyBtn} ${styles.stickyPrimary}`} onClick={()=>navigate('/pickup-delivery#book-repair')}><Icon name="truck" size={18}/>Free Pickup</button><a href="https://wa.me/919025790266?text=Hi%2C%20I%20need%20a%20repair%20quote" target="_blank" rel="noopener" className={`${styles.stickyBtn} ${styles.stickyWa}`}><Icon name="message" size={17}/>WhatsApp</a></motion.div>}</AnimatePresence>}
