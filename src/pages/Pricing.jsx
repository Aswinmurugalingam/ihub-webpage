import { motion } from 'framer-motion';
import { PricingSection, CtaBanner } from '../components/sections/Sections';
import Icon from '../components/ui/Icon';

export default function Pricing(){return <>
  <section style={{padding:'72px 0 28px',textAlign:'center'}}><div className="container"><motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6}}><span className="tag">Repair pricing</span><h1 style={{fontSize:'clamp(2.7rem,5.5vw,5rem)',marginTop:16}}>Transparent <span className="brand-text">starting ranges</span></h1><p style={{maxWidth:620,margin:'16px auto 0',color:'var(--fg2)',lineHeight:1.7}}>Use website prices as a starting guide. Exact model, fault, part option and availability determine the approved repair quote.</p><div style={{display:'flex',justifyContent:'center',gap:10,flexWrap:'wrap',marginTop:24}}><span className="tag"><Icon name="search" size={14}/>Diagnosis before final quote</span><span className="tag"><Icon name="wallet" size={14}/>Approval before repair</span></div></motion.div></div></section>
  <PricingSection showTitle={false}/>
  <section style={{padding:'0 0 96px'}}><div className="container"><CtaBanner title={<>Ready to repair? <span className="brand-text">Book or request pickup.</span></>} sub="Book a store visit or use free pickup & delivery for eligible supported-device repairs." btn1Text="Schedule Free Pickup" btn1Link="/pickup-delivery#book-repair" btn2Text="WhatsApp Quote" btn2Link="https://wa.me/919025790266?text=Hi%2C%20I%20need%20an%20exact%20repair%20quote"/></div></section>
</>}
