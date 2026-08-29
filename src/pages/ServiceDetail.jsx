import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SERVICES } from '../data/siteData';
import { CtaBanner } from '../components/sections/Sections';
import ScrollReveal from '../components/ui/ScrollReveal';
import Icon from '../components/ui/Icon';
import DeviceScene from '../components/3d/DeviceScene';
import styles from './ServiceDetail.module.css';

function partFromName(name=''){
  const v=name.toLowerCase();
  if(v.includes('screen')||v.includes('display')||v.includes('digitizer')) return 'screen';
  if(v.includes('battery')) return 'battery';
  if(v.includes('camera')||v.includes('face id')) return 'camera';
  if(v.includes('charging')||v.includes('port')) return 'port';
  if(v.includes('board')||v.includes('motherboard')||v.includes('chip')||v.includes('water')||v.includes('liquid')) return 'board';
  return '';
}

export default function ServiceDetail(){
  const {id}=useParams(); const navigate=useNavigate(); const service=SERVICES.find(s=>s.slug===id||String(s.id)===id); const [active,setActive]=useState('');
  const visualEligible=useMemo(()=>service&&[0,1,3,4,5,6].includes(service.id),[service]);
  if(!service) return <div style={{textAlign:'center',padding:'120px 24px'}}><h2>Service not found.</h2><button onClick={()=>navigate('/services')} className="btn-primary brand-grad" style={{marginTop:24}}>Back to Services</button></div>;
  const {detail}=service;
  return <>
    <section className={styles.hero}><div className="container"><div className={styles.heroGrid}>
      <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.65,ease:[.22,1,.36,1]}}><button className={styles.back} onClick={()=>navigate('/services')}>← Back to Services</button><span className="tag"><Icon name={service.emoji} size={15}/>{service.title}</span><h1 className={styles.h1}>{detail.hero}</h1><p className={styles.intro}>{detail.intro}</p><div className={styles.heroBtns}><button onClick={()=>navigate('/booking')} className="btn-primary brand-grad">Book This Repair</button><a href={`https://wa.me/919025790266?text=Hi%2C%20I%20need%20a%20${encodeURIComponent(service.title)}%20quote`} target="_blank" rel="noopener" className="btn-secondary">WhatsApp Quote</a></div></motion.div>
      {visualEligible?<DeviceScene exploded highlight={active} label={`Interactive ${service.title} repair visualizer`}/>:<div className={styles.heroVisualFallback}><div className={styles.fallbackIcon}><Icon name={service.emoji} size={64}/></div><strong>{service.title}</strong><span>Professional diagnosis & repair</span></div>}
    </div></div></section>

    <section className={styles.repairSec}><div className="container"><ScrollReveal><div className="section-header"><span className="tag">Interactive repair map</span><h2 style={{marginTop:14}}>Explore {service.title} <span className="brand-text">repair types</span></h2><p>Hover or tap a repair type. Relevant phone components illuminate where a device visual is available.</p></div></ScrollReveal><div className={styles.typesGrid}>{detail.types.map((t,i)=>{const part=partFromName(t.name);return <motion.button key={i} className={`${styles.typeCard} ${active===part&&part?styles.typeCardActive:''}`} onMouseEnter={()=>setActive(part)} onMouseLeave={()=>setActive('')} onFocus={()=>setActive(part)} onClick={()=>setActive(active===part?'':part)} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.035}}><div className={styles.typeIcon}><Icon name={t.icon}/></div><div className={styles.typeName}>{t.name}</div><p className={styles.typeDesc}>{t.desc}</p><span className={styles.typeHint}>{part?`Highlights ${part}`:'Service detail'}</span></motion.button>})}</div></div></section>

    <section className={styles.modelsSec}><div className="container"><ScrollReveal><span className="tag">Supported models</span><h2 style={{margin:'18px 0 28px'}}>Models we <span className="brand-text">commonly support</span></h2><p className={styles.modelsNote}>Model support depends on current parts availability. Contact iHub if your exact model is not listed.</p></ScrollReveal><div className={styles.modelsGrid}>{detail.models.map((m,i)=><motion.span key={i} className={styles.modelChip} initial={{opacity:0,scale:.88}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.35,delay:i*.025}}>{m}</motion.span>)}</div></div></section>

    {(service.id===0||service.id===1)&&<section className={styles.pickupBand}><div className="container"><div className={styles.pickupInner}><div className={styles.pickupIcon}><Icon name="truck" size={32}/></div><div><span className="tag">Doorstep option</span><h2>Free pickup & return delivery for eligible mobile repairs</h2><p>Choose Pickup & Delivery when booking. Address and service-area eligibility are confirmed before collection.</p></div><button className="btn-primary brand-grad" onClick={()=>navigate('/booking?method=pickup')}>Schedule Pickup</button></div></div></section>}

    <section style={{padding:'80px 0'}}><div className="container"><CtaBanner title={<>Ready to repair your <span className="brand-text">{service.title.split(' ')[0]}?</span></>} sub="Choose a store visit or request free pickup & delivery for an eligible mobile-phone repair." btn1Text="Schedule Free Pickup" btn1Link="/booking?method=pickup" btn2Text="Book Repair" btn2Link="/booking"/></div></section>
  </>;
}
