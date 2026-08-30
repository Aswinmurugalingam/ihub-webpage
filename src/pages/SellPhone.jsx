import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { flushSync } from 'react-dom';
import Icon from '../components/ui/Icon';
import ScrollReveal from '../components/ui/ScrollReveal';
import { createSellRequest, makeReference } from '../services/backend';
import { BRAND_OPTIONS, getBrandModels, searchPhoneModels } from '../data/phoneCatalog';
import sellPhoneHandover from '../assets/sell-phone-handover.png';
import styles from './SellPhone.module.css';

const STORAGE = ['32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB', 'Other'];
const SCREEN_CONDITIONS = ['Perfect', 'Minor scratches', 'Deep scratches', 'Cracked', 'Display issue'];
const BODY_CONDITIONS = ['Like new', 'Minor scratches', 'Heavy scratches', 'Dent', 'Back glass broken'];
const FUNCTION_CHECKS = ['Touch', 'Cameras', 'Speaker', 'Microphone', 'Charging', 'Wi-Fi / Bluetooth', 'SIM / Network', 'Face ID / Fingerprint', 'Buttons'];
const ACCESSORIES = ['Original box', 'Original bill', 'Charging cable', 'Adapter', 'Original accessories'];
const PHOTO_SLOTS = [
  ['front', 'Front', 'Front of the phone'],
  ['back', 'Back', 'Back of the phone'],
  ['left', 'Left side', 'Left frame / side'],
  ['right', 'Right side', 'Right frame / side'],
  ['screen', 'Screen on', 'Optional powered-on screen'],
  ['about', 'About / battery', 'Optional About Device or Battery Health'],
];

const STEP_LABELS = ['Phone', 'Condition', 'Checks', 'Photos', 'Accessories', 'Handover'];

function emptyFunctions() {
  return Object.fromEntries(FUNCTION_CHECKS.map(label => [label, true]));
}

function initialForm() {
  return {
    brand: '', model: '', storage: '', color: '', purchaseYear: '', batteryHealth: '',
    screenCondition: '', bodyCondition: '', functions: emptyFunctions(), repairedBefore: 'no', repairDetails: '',
    liquidDamage: 'no', switchesOn: 'yes', accountLock: 'no', financed: 'no', ownershipConfirmed: false, termsConfirmed: false,
    accessories: [], handoverMethod: 'store', address: '', area: '', landmark: '', pincode: '', preferredDate: '', preferredTime: '',
    name: '', phone: '', email: '', notes: '',
  };
}

function HeroVisual() {
  return (
    <motion.div
      className={styles.heroVisual}
      initial={{ opacity: 0, x: 28, scale: .965 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: .8, delay: .16, ease: [.22, 1, .36, 1] }}
    >
      <div className={styles.heroVisualGlow} aria-hidden="true" />
      <motion.div
        className={styles.handoverImageCard}
        animate={{ y: [-5, 5], rotateX: [0.7, -0.7], rotateY: [-0.9, 0.9] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      >
        <img
          src={sellPhoneHandover}
          alt="Customer handing a used phone to an iHub staff member for inspection and sale"
        />
        <div className={styles.imageEdgeGlow} aria-hidden="true" />
        <div className={styles.imageShine} aria-hidden="true" />
      </motion.div>
    </motion.div>
  );
}

function ChoiceGrid({ options, value, onChange }) {
  return <div className={styles.choiceGrid}>{options.map(option => <button key={option} type="button" className={`${styles.choiceBtn} ${value===option?styles.selected:''}`} onClick={()=>onChange(option)}>{option}{value===option&&<Icon name="check" size={16}/>}</button>)}</div>;
}

function Field({ label, value, onChange, placeholder, type='text', inputMode, wide=false, min, max }) {
  return <label className={`${styles.field} ${wide?styles.wide:''}`}><span>{label}</span><input type={type} inputMode={inputMode} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} min={min} max={max}/></label>;
}

function DateField({ label, value, onChange }) {
  const inputRef = useRef(null);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    if (typeof input.showPicker === 'function') {
      try { input.showPicker(); } catch { input.click(); }
    } else {
      input.click();
    }
  };

  return (
    <label className={`${styles.field} ${styles.dateField}`}>
      <span>{label}</span>
      <div className={styles.dateInputWrap}>
        <input
          ref={inputRef}
          className={styles.dateInput}
          type="date"
          value={value}
          onChange={e=>onChange(e.target.value)}
        />
        <button type="button" className={styles.datePickerBtn} onClick={openPicker} aria-label="Open calendar">
          <Icon name="calendar" size={20}/>
        </button>
      </div>
    </label>
  );
}

function BrandAutocomplete({ value, onSelect }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualValue, setManualValue] = useState('');

  useEffect(() => { setQuery(value || ''); }, [value]);

  const filtered = BRAND_OPTIONS.filter(brand => brand.toLowerCase().includes(query.trim().toLowerCase()));
  const choose = brand => {
    setOpen(false);
    if (brand === 'Other') {
      setManualValue(value && !BRAND_OPTIONS.includes(value) ? value : '');
      setManualOpen(true);
      return;
    }
    setManualOpen(false);
    setQuery(brand);
    onSelect(brand);
  };
  const confirmManual = () => {
    const clean = manualValue.trim();
    if (clean.length < 2) return;
    setQuery(clean);
    setManualOpen(false);
    onSelect(clean);
  };

  return <div className={styles.comboField}>
    <span className={styles.comboLabel}>Brand *</span>
    <div className={styles.comboWrap}>
      <Icon name="search" size={17} className={styles.comboIcon}/>
      <input
        value={query}
        onFocus={()=>setOpen(true)}
        onChange={e=>{ setQuery(e.target.value); setOpen(true); }}
        onBlur={()=>setTimeout(()=>setOpen(false),140)}
        placeholder="Search brand"
        autoComplete="off"
      />
      {query && <button type="button" className={styles.comboClear} onMouseDown={e=>e.preventDefault()} onClick={()=>{setQuery(''); onSelect(''); setOpen(true);}}>×</button>}
      {open && <div className={styles.comboMenu}>
        {(query ? filtered : BRAND_OPTIONS).map(brand => <button type="button" key={brand} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(brand)}><span>{brand}</span>{value===brand&&<Icon name="check" size={15}/>}</button>)}
        <button type="button" className={styles.comboOther} onMouseDown={e=>e.preventDefault()} onClick={()=>choose('Other')}><span>Other brand</span><small>Enter manually</small></button>
      </div>}
    </div>
    {manualOpen && <div className={styles.manualEntry}>
      <input autoFocus value={manualValue} onChange={e=>setManualValue(e.target.value)} placeholder="Type brand name" onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();confirmManual();}}}/>
      <button type="button" onClick={confirmManual} disabled={manualValue.trim().length<2}>OK</button>
      <button type="button" className={styles.manualCancel} onClick={()=>setManualOpen(false)}>Cancel</button>
    </div>}
  </div>;
}

function ModelAutocomplete({ brand, value, onSelect }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualValue, setManualValue] = useState('');

  useEffect(() => { setQuery(value || ''); }, [value]);

  const trimmed = query.trim();
  const suggestions = trimmed.length >= 3
    ? searchPhoneModels(trimmed, brand)
    : (open && brand && BRAND_OPTIONS.includes(brand) ? getBrandModels(brand).slice(0, 18).map(model=>({brand,model})) : []);

  const chooseModel = item => {
    setQuery(item.model);
    setOpen(false);
    setManualOpen(false);
    onSelect(item);
  };
  const openManual = () => {
    setOpen(false);
    setManualValue(value && !suggestions.some(item=>item.model===value) ? value : query);
    setManualOpen(true);
  };
  const confirmManual = () => {
    const clean = manualValue.trim();
    if (clean.length < 2) return;
    setQuery(clean);
    setManualOpen(false);
    onSelect({ brand: brand || '', model: clean });
  };

  return <div className={styles.comboField}>
    <span className={styles.comboLabel}>Exact model *</span>
    <div className={styles.comboWrap}>
      <Icon name="search" size={17} className={styles.comboIcon}/>
      <input
        value={query}
        onFocus={()=>setOpen(true)}
        onChange={e=>{ setQuery(e.target.value); setOpen(true); onSelect({brand, model:e.target.value, typing:true}); }}
        onBlur={()=>setTimeout(()=>setOpen(false),140)}
        autoComplete="off"
      />
      {query && <button type="button" className={styles.comboClear} onMouseDown={e=>e.preventDefault()} onClick={()=>{setQuery('');onSelect({brand,model:'',typing:true});setOpen(true);}}>×</button>}
      {open && <div className={styles.comboMenu}>
        {trimmed.length < 3 && <div className={styles.comboHint}>{brand ? `Type 3 letters or choose a ${brand} model` : 'Type at least 3 letters to search all phone models'}</div>}
        {suggestions.map(item => <button type="button" key={`${item.brand}-${item.model}`} onMouseDown={e=>e.preventDefault()} onClick={()=>chooseModel(item)}><span><strong>{item.model}</strong><small>{item.brand}</small></span>{value===item.model&&<Icon name="check" size={15}/>}</button>)}
        {trimmed.length >= 3 && suggestions.length===0 && <div className={styles.comboHint}>No matching model found.</div>}
        <button type="button" className={styles.comboOther} onMouseDown={e=>e.preventDefault()} onClick={openManual}><span>Other / model not listed</span><small>Enter manually</small></button>
      </div>}
    </div>
    {manualOpen && <div className={styles.manualEntry}>
      <input autoFocus value={manualValue} onChange={e=>setManualValue(e.target.value)} placeholder="Type exact model name" onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();confirmManual();}}}/>
      <button type="button" onClick={confirmManual} disabled={manualValue.trim().length<2}>OK</button>
      <button type="button" className={styles.manualCancel} onClick={()=>setManualOpen(false)}>Cancel</button>
    </div>}
  </div>;
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function SubmissionOverlay({ status, progress }) {
  const submitted = status === 'submitted';
  return <AnimatePresence>{(status==='sending'||submitted)&&<motion.div className={styles.submitOverlay} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <motion.div className={styles.submitOverlayCard} initial={{scale:.96,y:18}} animate={{scale:1,y:0}}>
      <div className={`${styles.submitSpinner} ${submitted?styles.submitDone:''}`}>{submitted?<Icon name="check" size={32}/>:<span/>}</div>
      <span className={styles.submitEyebrow}>{submitted?'REQUEST RECEIVED':'SECURE SUBMISSION'}</span>
      <h3>{submitted?'Request submitted':'Submitting your request…'}</h3>
      <p>{submitted?'Your Sell Phone request has been saved successfully.':progress?.message || 'Please keep this page open while we securely prepare your request.'}</p>
      {!submitted&&<><div className={styles.submitProgressTrack}><motion.div animate={{width:`${Math.max(6,Math.min(100,progress?.percent||12))}%`}}/></div><div className={styles.submitProgressMeta}><span>{progress?.phaseLabel||'Preparing'}</span><strong>{Math.round(progress?.percent||12)}%</strong></div></>}
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

async function compressImage(file) {
  if (!file || !file.type?.startsWith('image/')) return file;
  if (file.size < 900 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .82));
    if (!blob) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'phone'}.jpg`, { type:'image/jpeg', lastModified:Date.now() });
  } catch {
    return file;
  }
}

export default function SellPhone() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [photos, setPhotos] = useState({});
  const [photoPreviews, setPhotoPreviews] = useState({});
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [photoProcess, setPhotoProcess] = useState({});
  const [submitProgress, setSubmitProgress] = useState({ percent: 0, message: 'Preparing your request…', phaseLabel: 'Preparing' });

  const update = (key, value) => setForm(prev => ({...prev, [key]: value}));
  const phoneOk = form.phone.replace(/\D/g,'').length >= 10 && form.phone.replace(/\D/g,'').length <= 15;
  const pincodeOk = form.handoverMethod !== 'pickup' || /^\d{5,8}$/.test(form.pincode.replace(/\D/g,''));
  const requiredPhotosReady = ['front','back','left','right'].every(key => photos[key]);

  const canContinue = useMemo(() => {
    if (step===1) return form.brand && form.model.trim().length>=2 && form.storage && form.color.trim().length>=2 && (form.brand!=='Apple' || !form.batteryHealth || (+form.batteryHealth>=1 && +form.batteryHealth<=100));
    if (step===2) return Boolean(form.screenCondition && form.bodyCondition && form.repairedBefore);
    if (step===3) return form.liquidDamage && form.switchesOn && form.accountLock && form.financed && form.ownershipConfirmed;
    if (step===4) return requiredPhotosReady;
    if (step===5) return true;
    if (step===6) return form.name.trim().length>=2 && phoneOk && form.termsConfirmed && pincodeOk && (form.handoverMethod==='store' || (form.address.trim().length>=5 && form.area.trim().length>=2));
    return false;
  }, [step, form, phoneOk, pincodeOk, requiredPhotosReady]);

  const toggleFunction = label => setForm(prev => ({...prev, functions:{...prev.functions,[label]:!prev.functions[label]}}));
  const toggleAccessory = label => setForm(prev => ({...prev, accessories:prev.accessories.includes(label)?prev.accessories.filter(x=>x!==label):[...prev.accessories,label]}));

  const handlePhoto = async (slot, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (file.size > 8 * 1024 * 1024) { setError('Each photo must be smaller than 8 MB.'); return; }

    setError('');

    // Paint the loader immediately before any image decoding/compression starts.
    flushSync(() => {
      setPhotoProcess(prev=>({...prev,[slot]:{state:'processing',progress:8,label:'Reading image…'}}));
    });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    setPhotoProcess(prev=>({...prev,[slot]:{state:'processing',progress:28,label:'Reading image…'}}));
    await wait(70);
    setPhotoProcess(prev=>({...prev,[slot]:{state:'processing',progress:48,label:'Optimising photo…'}}));

    const prepared = await compressImage(file);

    setPhotoProcess(prev=>({...prev,[slot]:{state:'processing',progress:78,label:'Preparing preview…'}}));
    await new Promise(resolve => requestAnimationFrame(resolve));

    const previewUrl = URL.createObjectURL(prepared);
    setPhotos(prev => ({...prev,[slot]:prepared}));
    setPhotoPreviews(prev => {
      if (prev[slot]) URL.revokeObjectURL(prev[slot]);
      return {...prev,[slot]:previewUrl};
    });
    setPhotoProcess(prev=>({...prev,[slot]:{state:'ready',progress:100,label:'Ready to upload'}}));
  };

  const removePhoto = slot => {
    setPhotos(prev => { const next={...prev}; delete next[slot]; return next; });
    setPhotoPreviews(prev => { const next={...prev}; if(next[slot]) URL.revokeObjectURL(next[slot]); delete next[slot]; return next; });
    setPhotoProcess(prev => { const next={...prev}; delete next[slot]; return next; });
  };

  const submit = async () => {
    if (!canContinue || status==='sending') return;
    setStatus('sending'); setError('');
    const reference = makeReference('IH-SELL');
    const payload = {
      reference,
      brand: form.brand,
      model: form.model.trim(),
      storage: form.storage,
      color: form.color.trim(),
      purchase_year: form.purchaseYear || null,
      battery_health: form.brand==='Apple' && form.batteryHealth ? Number(form.batteryHealth) : null,
      screen_condition: form.screenCondition,
      body_condition: form.bodyCondition,
      functions: form.functions,
      repaired_before: form.repairedBefore,
      repair_details: form.repairDetails.trim(),
      liquid_damage: form.liquidDamage,
      switches_on: form.switchesOn,
      account_lock: form.accountLock,
      financed: form.financed,
      ownership_confirmed: form.ownershipConfirmed,
      terms_confirmed: form.termsConfirmed,
      accessories: form.accessories,
      handover_method: form.handoverMethod,
      address: form.handoverMethod==='pickup' ? form.address.trim() : '',
      area: form.handoverMethod==='pickup' ? form.area.trim() : '',
      landmark: form.handoverMethod==='pickup' ? form.landmark.trim() : '',
      pincode: form.handoverMethod==='pickup' ? form.pincode.trim() : '',
      preferred_date: form.preferredDate || null,
      preferred_time: form.preferredTime || '',
      customer_name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      notes: form.notes.trim(),
    };
    const photoEntries = Object.entries(photos).map(([slot,file])=>({slot,file}));
    try {
      setSubmitProgress({ percent: 8, message: 'Checking your details…', phaseLabel: 'Validating' });
      const minimumDelay = wait(1300);
      const saved = await createSellRequest(payload, photoEntries, progress => {
        setSubmitProgress({
          percent: progress.percent ?? 20,
          message: progress.message || 'Submitting your request…',
          phaseLabel: progress.phaseLabel || 'Submitting',
        });
      });
      await minimumDelay;
      setSubmitProgress({ percent: 100, message: 'Your request has been saved successfully.', phaseLabel: 'Complete' });
      setResult(saved);
      setStatus('submitted');
      await wait(1100);
      setStatus('success');
      window.scrollTo({top:0,behavior:'smooth'});
    } catch (e) {
      setStatus('error');
      setError(String(e?.message || 'Could not submit your sell request. Please try WhatsApp instead.'));
    }
  };

  if (status==='success' && result) {
    const wa = `https://wa.me/919025790266?text=${encodeURIComponent(`Hi iHub, I submitted a Sell Phone request. Reference: ${result.reference}. Device: ${result.brand} ${result.model} ${result.storage}.`)}`;
    return <section className={styles.successPage}><div className="container"><motion.div className={styles.successCard} initial={{opacity:0,y:24,scale:.97}} animate={{opacity:1,y:0,scale:1}}><div className={styles.successIcon}><Icon name="check" size={36}/></div><span className="tag">Sell request received</span><h1>We’ll review your <span className="brand-text">phone details.</span></h1><p>This is a request for review, not a guaranteed purchase price. iHub can confirm an indicative offer after reviewing the condition and photos, with the final amount confirmed after physical inspection.</p><div className={styles.reference}><span>Your reference</span><strong>{result.reference}</strong></div><div className={styles.successActions}><a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary brand-grad"><Icon name="message" size={17}/>Continue on WhatsApp</a><Link to="/" className="btn-secondary">Back Home</Link></div></motion.div></div></section>;
  }

  return <>
    <SubmissionOverlay status={status} progress={submitProgress}/>
    <section className={styles.hero}><div className="container"><div className={styles.heroLayout}>
      <motion.div className={styles.heroCopy} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.7,ease:[.22,1,.36,1]}}>
        <span className="tag">Sell your used phone</span>
        <h1>Turn your old phone <span className="brand-text">into value.</span></h1>
        <p>Tell iHub about your device, condition and accessories. Upload a few clear photos, request a review, then choose store handover or eligible pickup if you accept the offer.</p>
        <div className={styles.heroPoints}><div><Icon name="camera" size={18}/><span>Photo-based first review</span></div><div><Icon name="shield" size={18}/><span>Ownership confirmation</span></div><div><Icon name="wallet" size={18}/><span>Final price after inspection</span></div></div>
        <a href="#sell-form" className="btn-primary brand-grad"><Icon name="phone" size={17}/>Start Phone Valuation</a>
      </motion.div>
      <HeroVisual/>
    </div></div></section>

    <section className={styles.howSec}><div className="container"><ScrollReveal><div className="section-header"><span className="tag">How it works</span><h2>Simple from details to <span className="brand-text">final payment.</span></h2><p>The website collects the information needed for an initial review. The final offer is confirmed only after iHub physically inspects the device.</p></div></ScrollReveal><div className={styles.howGrid}>{[
      ['phone','Tell us about it','Brand, model, storage and condition.'],
      ['camera','Upload photos','Front, back and both sides for review.'],
      ['wallet','Receive an offer','iHub contacts you after reviewing the request.'],
      ['truck','Pickup or visit','Choose store handover or eligible collection.'],
      ['check','Inspect & get paid','Final value is confirmed after physical inspection.'],
    ].map(([icon,title,desc],i)=><ScrollReveal key={title} delay={i*.05}><div className={styles.howCard}><span>0{i+1}</span><div className={styles.howIcon}><Icon name={icon}/></div><h3>{title}</h3><p>{desc}</p></div></ScrollReveal>)}</div></div></section>

    <section id="sell-form" className={styles.formSection}><div className="container"><div className={styles.formShell}>
      <div className={styles.formIntro}><span className="tag">Request a valuation</span><h2>Tell us about <span className="brand-text">your phone.</span></h2><p>No automatic guaranteed price is shown. iHub reviews the details first so the offer can reflect the actual device condition.</p></div>
      <div className={styles.stepBar}>{STEP_LABELS.map((label,i)=>{const n=i+1;return <div key={label} className={`${styles.stepItem} ${step===n?styles.stepActive:''} ${step>n?styles.stepDone:''}`}><div className={styles.stepBubble}>{step>n?<Icon name="check" size={14}/>:n}</div><span>{label}</span></div>})}</div>

      <div className={styles.formCard}><AnimatePresence mode="wait"><motion.div key={step} initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}} transition={{duration:.25}}>
        {step===1&&<><div className={styles.cardHead}><span>Step 01</span><h3>Phone details</h3><p>Start with the exact device information. This helps iHub identify the correct market range.</p></div><div className={styles.formGrid}>
          <BrandAutocomplete value={form.brand} onSelect={brand=>setForm(prev=>({...prev,brand,model:brand===prev.brand?prev.model:''}))}/>
          <ModelAutocomplete brand={form.brand} value={form.model} onSelect={item=>setForm(prev=>({...prev,brand:item.brand||prev.brand,model:item.model}))}/>
          <label className={styles.field}><span>Storage *</span><select value={form.storage} onChange={e=>update('storage',e.target.value)}><option value="">Select storage</option>{STORAGE.map(x=><option key={x}>{x}</option>)}</select></label>
          <Field label="Colour *" value={form.color} onChange={v=>update('color',v)} placeholder="e.g. Natural Titanium"/>
          <Field label="Approx. purchase year" value={form.purchaseYear} onChange={v=>update('purchaseYear',v)} placeholder="e.g. 2024" type="number" min="2010" max="2030"/>
          {form.brand==='Apple'&&<Field label="Battery health %" value={form.batteryHealth} onChange={v=>update('batteryHealth',v)} placeholder="e.g. 88" type="number" min="1" max="100"/>}
        </div></>}

        {step===2&&<><div className={styles.cardHead}><span>Step 02</span><h3>Physical & functional condition</h3><p>Be as accurate as possible. The initial offer can change if the physical inspection differs from the submitted condition.</p></div><div className={styles.conditionBlock}><h4>Screen condition *</h4><ChoiceGrid options={SCREEN_CONDITIONS} value={form.screenCondition} onChange={v=>update('screenCondition',v)}/></div><div className={styles.conditionBlock}><h4>Body condition *</h4><ChoiceGrid options={BODY_CONDITIONS} value={form.bodyCondition} onChange={v=>update('bodyCondition',v)}/></div><div className={styles.conditionBlock}><h4>What currently works?</h4><div className={styles.functionGrid}>{FUNCTION_CHECKS.map(label=><button type="button" key={label} className={`${styles.functionBtn} ${form.functions[label]?styles.functionOn:styles.functionOff}`} onClick={()=>toggleFunction(label)}><Icon name={form.functions[label]?'check':'help'} size={16}/><span>{label}</span><small>{form.functions[label]?'Works':'Issue'}</small></button>)}</div></div><div className={styles.conditionBlock}><h4>Has the phone been repaired before?</h4><ChoiceGrid options={['no','yes','not sure']} value={form.repairedBefore} onChange={v=>update('repairedBefore',v)}/>{form.repairedBefore==='yes'&&<label className={`${styles.field} ${styles.repairNote}`}><span>What was repaired?</span><textarea value={form.repairDetails} onChange={e=>update('repairDetails',e.target.value)} placeholder="Screen, battery, board work, back glass, etc." rows="3"/></label>}</div></>}

        {step===3&&<><div className={styles.cardHead}><span>Step 03</span><h3>Ownership & important checks</h3><p>These checks help avoid delays during handover. Account locks and finance status are verified again before purchase.</p></div><div className={styles.checkRows}>{[
          ['Liquid / water damage?', 'liquidDamage', ['no','yes','not sure']],
          ['Does the phone switch on normally?', 'switchesOn', ['yes','no','sometimes']],
          ['Any Apple / Google / Samsung account lock?', 'accountLock', ['no','yes','not sure']],
          ['Is the device under EMI / finance?', 'financed', ['no','yes','not sure']],
        ].map(([label,key,options])=><div className={styles.checkRow} key={key}><div><strong>{label}</strong>{key==='accountLock'&&<small>Any activation/account lock must be removed before final handover.</small>}</div><ChoiceGrid options={options} value={form[key]} onChange={v=>update(key,v)}/></div>)}</div><label className={styles.confirmBox}><input type="checkbox" checked={form.ownershipConfirmed} onChange={e=>update('ownershipConfirmed',e.target.checked)}/><span><strong>I confirm I am the legal owner of this device.</strong><small>I have the right to sell the phone and can provide reasonable ownership information if requested during inspection.</small></span></label></>}

        {step===4&&<><div className={styles.cardHead}><span>Step 04</span><h3>Upload phone photos</h3><p>Front, back, left and right photos are required. Clear photos help iHub make a better first assessment. Optional screenshots can be added too.</p></div><div className={styles.photoGrid}>{PHOTO_SLOTS.map(([slot,title,desc],i)=>{const required=i<4;const process=photoProcess[slot];const processing=process?.state==='processing';return <div className={`${styles.photoBox} ${photoPreviews[slot]?styles.photoFilled:''} ${processing?styles.photoProcessing:''}`} key={slot}>{processing?<div className={styles.photoLoading}><div className={styles.photoSpinner}/><strong>{process.label}</strong><span>{process.progress}%</span><div className={styles.photoLoadTrack}><div style={{width:`${process.progress}%`}}/></div></div>:photoPreviews[slot]?<><img src={photoPreviews[slot]} alt={`${title} preview`}/><div className={styles.photoReadyBadge}><Icon name="check" size={14}/><span>Ready</span></div><div className={styles.photoOverlay}><span>{title}</span><button type="button" onClick={()=>removePhoto(slot)}>Remove</button></div></>:<label><div className={styles.photoIcon}><Icon name="camera" size={24}/></div><strong>{title}{required?' *':''}</strong><span>{desc}</span><small>JPG / PNG / WEBP · max 8 MB</small><input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={e=>handlePhoto(slot,e.target.files?.[0])}/></label>}</div>})}</div><div className={styles.privacyMini}><Icon name="shield" size={18}/><span>Photos are optimised first and securely uploaded when you submit the request.</span></div></>}

        {step===5&&<><div className={styles.cardHead}><span>Step 05</span><h3>Box, bill & accessories</h3><p>Select everything you can hand over with the phone. Accessories and proof of purchase may affect the final value.</p></div><div className={styles.accessoryGrid}>{ACCESSORIES.map(item=><button key={item} type="button" className={`${styles.accessoryBtn} ${form.accessories.includes(item)?styles.selected:''}`} onClick={()=>toggleAccessory(item)}><div><Icon name={form.accessories.includes(item)?'check':'layers'} size={20}/><strong>{item}</strong></div><span>{form.accessories.includes(item)?'Included':'Not selected'}</span></button>)}</div><label className={`${styles.field} ${styles.notesField}`}><span>Anything else to mention?</span><textarea value={form.notes} onChange={e=>update('notes',e.target.value)} placeholder="Optional notes about condition, accessories or the phone" rows="4"/></label></>}

        {step===6&&<><div className={styles.cardHead}><span>Step 06</span><h3>Handover & contact details</h3><p>Choose how you would like iHub to receive the phone if you accept the offer.</p></div><div className={styles.handoverGrid}><button type="button" className={`${styles.handoverCard} ${form.handoverMethod==='store'?styles.selected:''}`} onClick={()=>update('handoverMethod','store')}><Icon name="pin" size={28}/><strong>Visit iHub Store</strong><span>Bring the device after the offer is discussed.</span></button><button type="button" className={`${styles.handoverCard} ${form.handoverMethod==='pickup'?styles.selected:''}`} onClick={()=>update('handoverMethod','pickup')}><Icon name="truck" size={28}/><strong>Request Pickup</strong><span>Available after iHub confirms eligibility and area.</span></button></div><div className={styles.formGrid}>
          <Field label="Full name *" value={form.name} onChange={v=>update('name',v)} placeholder="Your name"/>
          <Field label="Phone / WhatsApp *" value={form.phone} onChange={v=>update('phone',v)} placeholder="+91 9XXXXXXXXX" type="tel" inputMode="tel"/>
          <Field label="Email (optional)" value={form.email} onChange={v=>update('email',v)} placeholder="you@example.com" type="email"/>
          <DateField label="Preferred date" value={form.preferredDate} onChange={v=>update('preferredDate',v)}/>
          <label className={styles.field}><span>Preferred time</span><select value={form.preferredTime} onChange={e=>update('preferredTime',e.target.value)}><option value="">Any convenient time</option><option>10:00 AM - 12:00 PM</option><option>12:00 PM - 2:00 PM</option><option>2:00 PM - 4:00 PM</option><option>4:00 PM - 6:00 PM</option><option>6:00 PM - 8:00 PM</option></select></label>
          {form.handoverMethod==='pickup'&&<><Field label="House / building & street *" value={form.address} onChange={v=>update('address',v)} placeholder="Pickup address" wide/><Field label="Area *" value={form.area} onChange={v=>update('area',v)} placeholder="Area / locality"/><Field label="Pincode *" value={form.pincode} onChange={v=>update('pincode',v)} placeholder="629..." inputMode="numeric"/><Field label="Landmark" value={form.landmark} onChange={v=>update('landmark',v)} placeholder="Nearby landmark"/></>}
        </div>{form.phone&&!phoneOk&&<p className={styles.validation}>Enter a valid 10 to 15 digit phone number.</p>}{form.handoverMethod==='pickup'&&form.pincode&&!pincodeOk&&<p className={styles.validation}>Enter a valid 5 to 8 digit pincode.</p>}<div className={styles.summary}><div><span>Device</span><strong>{form.brand} {form.model} · {form.storage}</strong></div><div><span>Condition</span><strong>{form.screenCondition} screen · {form.bodyCondition} body</strong></div><div><span>Photos</span><strong>{Object.keys(photos).length} uploaded</strong></div><div><span>Handover</span><strong>{form.handoverMethod==='pickup'?'Request pickup':'Visit iHub Store'}</strong></div></div><label className={styles.confirmBox}><input type="checkbox" checked={form.termsConfirmed} onChange={e=>update('termsConfirmed',e.target.checked)}/><span><strong>I understand the first offer is not the final guaranteed price.</strong><small>The final buying price is confirmed only after physical inspection. I will back up my data, remove account/activation locks and prepare the device for handover before sale.</small></span></label></>}

        {error&&<div className={styles.error}><Icon name="help" size={18}/><span>{error}</span></div>}
        <div className={styles.formNav}>{step>1?<button type="button" className="btn-secondary" onClick={()=>{setError('');setStep(s=>s-1)}}>Back</button>:<span/>}{step<6?<button type="button" className="btn-primary brand-grad" disabled={!canContinue} onClick={()=>{setError('');setStep(s=>s+1)}}>Continue →</button>:<button type="button" className="btn-primary brand-grad" disabled={!canContinue||status==='sending'} onClick={submit}>{status==='sending'?'Submitting…':'Request My Offer'}</button>}</div>
      </motion.div></AnimatePresence></div>
    </div></div></section>


    <section className={styles.beforeSec}><div className="container"><ScrollReveal><div className={styles.beforeCard}><div><span className="tag">Before final handover</span><h2>Protect your <span className="brand-text">data first.</span></h2><p>Back up important photos and files. Before the final purchase, remove Apple/Google/Samsung account locks, remove your SIM where applicable and factory-reset the phone only when you are ready to hand it over.</p></div><a href="https://wa.me/919025790266?text=Hi%20iHub%2C%20I%20want%20to%20sell%20my%20used%20phone" target="_blank" rel="noopener noreferrer" className="btn-secondary"><Icon name="message" size={17}/>Ask on WhatsApp</a></div></ScrollReveal></div></section>
  </>;
}
