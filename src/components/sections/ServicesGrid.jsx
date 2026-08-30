import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { SERVICES } from '../../data/siteData';
import TiltCard from '../ui/TiltCard';
import ScrollReveal from '../ui/ScrollReveal';
import Icon from '../ui/Icon';
import styles from './ServicesGrid.module.css';

function ServiceModal({ service, onClose }) {
  useEffect(() => {
    if (!service) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [service, onClose]);

  if (!service) return null;
  const detail = service.detail;
  const isPickupEligible = service.id === 0 || service.id === 1;
  const whatsapp = `https://wa.me/919025790266?text=${encodeURIComponent(`Hi, I need a ${service.title} quote`)}`;

  return (
    <motion.div
      className={styles.modalBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .22 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <motion.section
        className={styles.modal}
        initial={{ opacity: 0, scale: .94, y: 26 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: .96, y: 18 }}
        transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`service-modal-${service.id}`}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close service details">×</button>

        <div className={styles.modalTopGlow} aria-hidden="true" />
        <div className={styles.modalHeader}>
          <div className={styles.modalIcon}><Icon name={service.emoji} size={30}/></div>
          <div>
            <span className={styles.modalEyebrow}>iHub repair service</span>
            <h2 id={`service-modal-${service.id}`}>{service.title}</h2>
          </div>
        </div>

        <div className={styles.modalScroll}>
          <div className={styles.modalHeroCopy}>
            <h3>{detail.hero}</h3>
            <p>{detail.intro}</p>
          </div>

          {isPickupEligible && (
            <div className={styles.pickupNotice}>
              <Icon name="truck" size={20}/>
              <div>
                <strong>Free Pickup + Free Delivery</strong>
                <span>Available for eligible supported-device repairs in supported Nagercoil areas.</span>
              </div>
            </div>
          )}

          <div className={styles.modalSectionHead}>
            <span>Repair options</span>
            <strong>{detail.types.length} services</strong>
          </div>
          <div className={styles.repairTypes}>
            {detail.types.map((item, index) => (
              <motion.article
                key={`${service.id}-${item.name}`}
                className={styles.repairType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * .025, .18) }}
              >
                <div className={styles.repairTypeIcon}><Icon name={item.icon} size={19}/></div>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <div className={styles.modalSectionHead}>
            <span>Commonly supported</span>
            <strong>Models / devices</strong>
          </div>
          <div className={styles.modelChips}>
            {detail.models.map((model) => <span key={model}>{model}</span>)}
          </div>
        </div>

        <div className={styles.modalActions}>
          <Link to="/pickup-delivery#book-repair" className="btn-primary brand-grad">Book This Repair</Link>
          {isPickupEligible && <Link to="/pickup-delivery#book-repair" className="btn-secondary"><Icon name="truck" size={16}/> Free Pickup</Link>}
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-secondary">WhatsApp Quote</a>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default function ServicesGrid({limit,showViewAll=false}){
  const navigate=useNavigate();
  const [selectedService,setSelectedService]=useState(null);
  const data=limit?SERVICES.slice(0,limit):SERVICES;

  return <>
    <div className={styles.grid}>
      {data.map((s,i)=><ScrollReveal key={s.id} delay={i*.05}>
        <TiltCard className={styles.card} intensity={7} onClick={()=>setSelectedService(s)}>
          <div className={styles.icon}><Icon name={s.emoji} size={27}/></div>
          <div className={styles.index}>0{s.id+1}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
          <div className={styles.learn}>View details <span>＋</span></div>
        </TiltCard>
      </ScrollReveal>)}
    </div>
    {showViewAll&&<div style={{textAlign:'center',marginTop:36}}><button onClick={()=>navigate('/services')} className="btn-secondary">View all repair services →</button></div>}
    <AnimatePresence>{selectedService && <ServiceModal service={selectedService} onClose={()=>setSelectedService(null)}/>}</AnimatePresence>
  </>;
}
