// ─── SERVICES DATA ───
export const SERVICES = [
  {
    id: 0, slug: 'iphone-repair', emoji: '📱', title: 'iPhone Repair',
    desc: 'Display, battery, Face ID, charging port, water damage — all iPhone models from 6 to 16 Pro Max.',
    detail: {
      hero: 'Apple iPhone repair — from common replacements to advanced diagnosis.',
      intro: 'Our experienced technicians work across iPhone models using quality-tested replacement options. Warranty terms depend on the repair and selected part grade.',
      types: [
        { icon: '🖥️', name: 'Screen & Display Replacement', desc: 'Cracked or unresponsive screens replaced with compatible OLED/LCD options. Calibration support is completed where the model allows it.' },
        { icon: '🔋', name: 'Battery Replacement', desc: 'Replace worn batteries with quality-tested cells and complete post-repair battery checks. Typical turnaround depends on model and workload.' },
        { icon: '👁️', name: 'Face ID & Dot Projector Fix', desc: 'Face ID and TrueDepth-related faults are diagnosed carefully; repair options depend on the affected component and model.' },
        { icon: '⚡', name: 'Charging Port Repair', desc: 'Lightning and USB-C ports cleaned, repaired, or fully replaced.' },
        { icon: '💧', name: 'Water Damage Recovery', desc: 'Ultrasonic cleaning and board-level corrosion treatment. Recovery depends on liquid exposure and component damage.' },
        { icon: '🔊', name: 'Speaker & Microphone Repair', desc: 'Earpiece, loudspeaker and microphone faults are diagnosed and the affected part is serviced or replaced as appropriate.' },
        { icon: '📸', name: 'Camera Repair', desc: 'Blurry photos, camera faults or broken lens glass are diagnosed and the affected camera component is serviced or replaced.' },
        { icon: '⚙️', name: 'Logic Board / Chip-Level', desc: 'Micro-soldering by chip-level experts. No-power, bootloop, NAND corruption.' },
        { icon: '🔑', name: 'Passcode & Software Fix', desc: 'Forgot passcode, stuck in recovery mode, or iOS crash loops resolved.' },
      ],
      models: ['iPhone 6', 'iPhone 7', 'iPhone 8', 'iPhone X', 'iPhone XS', 'iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15', 'iPhone 16', 'iPhone 16 Pro Max'],
    },
  },
  {
    id: 1, slug: 'android-repair', emoji: '🤖', title: 'Android Repair',
    desc: 'Samsung, OnePlus, Xiaomi, Realme, Vivo, Oppo & more. Screen, software, mic, speaker.',
    detail: {
      hero: 'Every Android brand — diagnosed carefully and repaired with the right workflow.',
      intro: 'From Samsung flagships to Xiaomi, OnePlus, Vivo, Oppo, Realme and more, our Android team handles common repairs with quality-tested replacement options.',
      types: [
        { icon: '🖥️', name: 'Screen Replacement', desc: 'AMOLED and IPS LCD screens replaced for all major Android brands.' },
        { icon: '🔋', name: 'Battery Replacement', desc: 'Quality-tested replacement battery fitted and checked for charging and battery performance.' },
        { icon: '⚡', name: 'Charging Port Repair', desc: 'Type-C port repaired or replaced. Fast charge functionality restored.' },
        { icon: '💧', name: 'Water Damage Recovery', desc: 'Ultrasonic board cleaning and corrosion treatment. Recovery time depends on the extent of liquid damage.' },
        { icon: '🔊', name: 'Speaker & Mic Repair', desc: 'Earpiece, loudspeaker, and microphone serviced or replaced.' },
        { icon: '📸', name: 'Camera Repair', desc: 'Front and rear camera faults are diagnosed and supported modules can be replaced when required.' },
        { icon: '⚙️', name: 'Motherboard Repair', desc: 'No-power, bootloop, or unknown fault. Chip-level diagnosis and micro-soldering.' },
        { icon: '📲', name: 'Software & Flashing', desc: 'Boot loops, malware symptoms and slow performance diagnosed with the least-destructive software route available. Backups are recommended.' },
        { icon: '👆', name: 'Back Glass Replacement', desc: 'Shattered back glass for Samsung and other supported brands replaced to restore the device finish.' },
      ],
      models: ['Samsung Galaxy S24', 'Samsung Galaxy A55', 'OnePlus 12', 'Xiaomi 14', 'Redmi Note 13', 'Realme GT 6', 'Vivo V30', 'Oppo Reno 12', 'Google Pixel 8', 'Nothing Phone 2'],
    },
  },
  {
    id: 2, slug: 'laptop-macbook-repair', emoji: '💻', title: 'Laptop & MacBook',
    desc: 'MacBook Air/Pro, Dell, HP, Lenovo, Asus. Logic board, keyboard, SSD upgrade, hinge repair.',
    detail: {
      hero: 'MacBook & major laptop brands — specialist repair service.',
      intro: 'MacBook and Windows laptop repair under one roof, including board-level diagnosis and quality-tested replacement components.',
      types: [
        { icon: '💡', name: 'Screen Replacement', desc: 'IPS and Retina panels replaced for all laptop brands.' },
        { icon: '⌨️', name: 'Keyboard Replacement', desc: 'Full keyboard assembly replaced. Backlight restored.' },
        { icon: '🔋', name: 'Battery Replacement', desc: 'Quality-tested replacement fitted and calibrated where supported.' },
        { icon: '💾', name: 'SSD / RAM Upgrade', desc: 'Upgrade to NVMe SSD or add RAM. All data migrated safely.' },
        { icon: '💧', name: 'Water / Liquid Damage', desc: 'Ultrasonic board cleaning. MacBooks and Windows laptops recovered.' },
        { icon: '⚙️', name: 'Logic Board / Motherboard', desc: 'Chip-level micro-soldering for no-power, no-display, or GPU failure.' },
        { icon: '🖥️', name: 'Screen Hinge Repair', desc: 'Broken or stiff hinge repaired or replaced on all laptop brands.' },
        { icon: '❄️', name: 'Overheating / Fan Fix', desc: 'Thermal paste replacement, fan cleaning and replacement.' },
        { icon: '⚡', name: 'Charging Port Repair', desc: 'MagSafe, USB-C, and all laptop charging port types serviced.' },
      ],
      models: ['MacBook Air M1/M2/M3', 'MacBook Pro 14"', 'MacBook Pro 16"', 'Dell XPS 15', 'HP Spectre x360', 'Lenovo ThinkPad X1', 'Asus ZenBook 14', 'Acer Swift 5', 'HP Pavilion', 'Dell Inspiron'],
    },
  },
  {
    id: 3, slug: 'ipad-tablet-repair', emoji: '📟', title: 'iPad & Tablet',
    desc: 'iPad Pro, Air, Mini & Android tablets. Touch, LCD, battery & charging issues fixed.',
    detail: {
      hero: 'iPad & tablets repaired with quality-tested replacement options.',
      intro: 'From a cracked iPad Pro screen to a dead battery in your Android tablet — our specialists handle it all.',
      types: [
        { icon: '🖥️', name: 'Screen & Digitizer Replacement', desc: 'Full display assembly replaced for all iPad and Android tablet models.' },
        { icon: '🔋', name: 'Battery Replacement', desc: 'Replacement battery fitted, tested and calibrated where supported.' },
        { icon: '⚡', name: 'Charging Port Repair', desc: 'Lightning, USB-C, or microUSB port repaired or replaced.' },
        { icon: '📶', name: 'Wi-Fi & Network Fix', desc: 'No Wi-Fi, dropping signal, or Bluetooth issues. Antenna and module repair.' },
        { icon: '🔊', name: 'Speaker Repair', desc: 'No sound, crackling audio, or distorted speakers replaced.' },
        { icon: '📸', name: 'Camera Repair', desc: 'Front and rear camera faults are diagnosed and supported modules can be replaced when required.' },
        { icon: '🔑', name: 'Passcode Unlock', desc: 'Software-access issues assessed within device security and ownership requirements. Data preservation cannot be guaranteed.' },
        { icon: '⚙️', name: 'Logic Board Repair', desc: 'No power or boot issues. Board-level diagnosis and component repair.' },
        { icon: '🪟', name: 'Back Housing Repair', desc: 'Cracked back glass or bent chassis repaired or replaced.' },
      ],
      models: ['iPad Pro 12.9"', 'iPad Pro 11"', 'iPad Air 5', 'iPad Mini 6', 'Samsung Galaxy Tab S9', 'Xiaomi Pad 6', 'Lenovo Tab P12', 'OnePlus Pad'],
    },
  },
  {
    id: 4, slug: 'battery-replacement', emoji: '🔋', title: 'Battery Replacement',
    desc: 'Battery replacement for major mobile and laptop models, followed by charging and performance checks.',
    detail: {
      hero: 'Battery replacement with post-repair charging and performance checks.',
      intro: 'We support battery replacement across many device models. Available part grades, turnaround and warranty are confirmed before repair.',
      types: [
        { icon: '📱', name: 'iPhone Battery', desc: 'iPhone battery replacement with charging, battery and relevant function checks after repair.' },
        { icon: '🤖', name: 'Android Phone Battery', desc: 'Major Android brands supported with quality-tested replacement cells and post-repair checks.' },
        { icon: '💻', name: 'MacBook Battery', desc: 'MacBook Air and Pro battery replacement with calibration where supported.' },
        { icon: '📟', name: 'iPad & Tablet Battery', desc: 'All iPad generations and Android tablets. Fast, safe replacement.' },
        { icon: '🖥️', name: 'Laptop Battery', desc: 'Dell, HP, Lenovo, Asus and more. Quality-tested replacement options with charging checks.' },
        { icon: '📊', name: 'Battery Health Check', desc: 'Battery condition and charging behavior can be assessed before deciding whether replacement is needed.' },
      ],
      models: ['iPhone 6 – 16 Pro Max', 'Samsung Galaxy S / A Series', 'OnePlus 8 – 12', 'MacBook Air M1/M2/M3', 'MacBook Pro 13" / 14" / 16"', 'iPad Pro / Air / Mini', 'Dell / HP / Lenovo Laptops'],
    },
  },
  {
    id: 5, slug: 'water-damage-repair', emoji: '💧', title: 'Water Damage',
    desc: 'Ultrasonic cleaning, board-level recovery for water and liquid-damaged devices.',
    detail: {
      hero: 'Water damaged? Act quickly — early diagnosis can improve the chance of recovery.',
      intro: 'Time matters with liquid damage. The device is inspected for corrosion and board-level faults, with recovery options explained after diagnosis.',
      types: [
        { icon: '🔬', name: 'Ultrasonic Board Cleaning', desc: 'Industrial ultrasonic cleaner removes corrosion and liquid residue from all circuit boards.' },
        { icon: '🔍', name: 'Component-Level Diagnosis', desc: 'Full board inspection under microscope to identify corroded ICs and traces.' },
        { icon: '⚙️', name: 'Component Replacement', desc: 'Corroded components replaced with precision soldering equipment.' },
        { icon: '💾', name: 'Data Recovery', desc: 'Even if the device won\'t power on, we attempt to extract contacts, photos, and files.' },
        { icon: '📱', name: 'iPhone Water Damage', desc: 'iPhone corrosion treatment and careful resealing where practical. Original factory water resistance cannot be guaranteed after repair.' },
        { icon: '💻', name: 'MacBook & Laptop Water Damage', desc: 'Keyboard, trackpad, and logic board treatment. Most MacBook liquid spills fully recoverable.' },
      ],
      models: ['All iPhones', 'All Android phones', 'MacBook Air / Pro', 'Windows Laptops', 'iPad / Tablets', 'Smartwatches'],
    },
  },
  {
    id: 6, slug: 'chip-level-repair', emoji: '⚙️', title: 'Chip-Level Repair',
    desc: 'Motherboard micro-soldering, IC replacement, no-power & no-charge fixes.',
    detail: {
      hero: 'Chip-level micro-soldering — where others stop, we start.',
      intro: 'Most shops replace the whole board. We fix it. Our engineers use microscopes, hot-air stations, and BGA re-balling equipment to repair at component level.',
      types: [
        { icon: '⚡', name: 'No Power / Dead Board Fix', desc: 'Diagnose and repair PMIC, power management IC, and fuse failures.' },
        { icon: '📶', name: 'No Charge Fix', desc: 'Tristar / Hydra IC, TIGRIS, and USB-C charging controller repair.' },
        { icon: '🖥️', name: 'No Display / Backlight Fix', desc: 'Backlight filter, display IC, and connector pad repair for black screen issues.' },
        { icon: '📡', name: 'No Signal / Baseband Repair', desc: 'Baseband CPU, BBPMU, and RF IC repair for no SIM or no signal.' },
        { icon: '🧠', name: 'NAND Flash Repair / Reballing', desc: 'NAND chip removal, reballing, and re-soldering for storage corruption.' },
        { icon: '🎮', name: 'GPU & CPU Reballing', desc: 'Laptop and MacBook GPU reballing for video artifacts or no display.' },
        { icon: '💧', name: 'Corrosion & Liquid Damage', desc: 'Board-level corrosion removal and component replacement under microscope.' },
        { icon: '🔧', name: 'BGA Rework', desc: 'Full BGA component removal, site preparation, reballing and reflow.' },
      ],
      models: ['All iPhone Models', 'Samsung Galaxy Flagships', 'MacBook Logic Boards', 'Windows Laptop Motherboards', 'iPad Logic Boards', 'All Android Flagships'],
    },
  },
  {
    id: 7, slug: 'data-recovery', emoji: '💾', title: 'Data Recovery',
    desc: 'Recover photos, contacts & files from dead phones, laptops and damaged drives.',
    detail: {
      hero: 'Lost data? We recover what you thought was gone forever.',
      intro: 'Our data recovery specialists use professional tools to retrieve photos, contacts, documents, and videos from devices that won\'t power on.',
      types: [
        { icon: '📱', name: 'Android Data Recovery', desc: 'Recover photos, WhatsApp messages, contacts, and files from dead Android phones.' },
        { icon: '🍎', name: 'iPhone Data Recovery', desc: 'Recover data from water-damaged, broken screen, or dead iPhone.' },
        { icon: '💻', name: 'Laptop / HDD Recovery', desc: 'Recover files from failed hard drives, corrupted SSDs, and formatted partitions.' },
        { icon: '📷', name: 'SD Card & USB Recovery', desc: 'Lost photos from camera SD cards or accidentally deleted files.' },
        { icon: '🔒', name: 'Encrypted Drive Recovery', desc: 'Assist with BitLocker, FileVault, and encrypted partition recovery.' },
        { icon: '📊', name: 'Recovery Assessment', desc: 'The device or drive is assessed first so the likely recovery route, limitations and any applicable charge can be explained.' },
      ],
      models: ['All Android Phones', 'All iPhones', 'MacBook / Windows Laptops', 'External Hard Drives', 'SSD & NVMe Drives', 'SD Cards & USB Flash'],
    },
  },
];

// ─── PRICING ───
export const PRICING = [
  {
    name: 'Screen Replacement', from: '₹1,499', featured: true,
    points: ['Multiple display options', 'Post-repair display check', 'Warranty confirmed upfront', 'Turnaround depends on model'],
  },
  {
    name: 'Battery Replacement', from: '₹999', featured: false,
    points: ['Quality-tested replacement', 'Charging & battery checks', 'Model-dependent turnaround', 'Warranty confirmed upfront'],
  },
  {
    name: 'Motherboard / Chip-Level', from: '₹2,499', featured: false,
    points: ['Board-level diagnosis', 'Repair approval before work', 'Microscope / micro-soldering capability', 'Warranty confirmed by job'],
  },
];

// ─── TESTIMONIALS ───
export const TESTIMONIALS = []; // Add only verified customer reviews before publishing.


// ─── WHY US ───
export const WHY_US = [
  { icon: '🛡️', title: 'Quality-Tested Parts', desc: 'Part grade and warranty are explained before repair so you can choose the right option for your device.' },
  { icon: '🏅', title: 'Experienced Technicians', desc: 'Hands-on multi-brand repair experience covering common replacements through board-level diagnosis.' },
  { icon: '⏱️', title: 'Practical Turnaround', desc: 'Common repairs can be completed quickly when parts are available; complex repairs receive a realistic time estimate.' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'The likely cost is explained before approved repair work begins, with any change discussed before proceeding.' },
  { icon: '😊', title: 'Customer-First Service', desc: 'Clear communication, repair approval before work, and practical support from diagnosis to handover.' },
  { icon: '🚚', title: 'Free Pickup & Drop', desc: 'Doorstep pickup and delivery available. Call to check your area.' },
];

// ─── CONTACT ───
export const CONTACT_ITEMS = [
  { icon: '📍', label: 'Store Location', value: 'Near Tea Park, Yesudhasan Complex, Vepamoodu Junction, Nagercoil', href: 'https://maps.app.goo.gl/fe5WVnTVRojT163x6', external: true },
  { icon: '📞', label: 'Call Us', value: '+91 90257 90266', href: 'tel:+919025790266', external: false },
  { icon: '💬', label: 'WhatsApp', value: '+91 90257 90266', href: 'https://wa.me/919025790266?text=Hi%2C%20I%20need%20a%20repair%20quote', external: true },
  { icon: '🕐', label: 'Working Hours', value: 'Mon-Sun · 10:00 AM - 9:00 PM', href: null, external: false },
];

// ─── ABOUT ───
export const ABOUT_VALUES = [
  { icon: '🏅', title: 'Repair Expertise', desc: 'Our team focuses on careful diagnostics, multi-brand repair skills and continuous technical learning.' },
  { icon: '🔒', title: 'Full Transparency', desc: "The diagnosis, proposed repair and expected cost are explained before approved work begins, with changes discussed before proceeding." },
  { icon: '⚡', title: 'Efficient Workflow', desc: 'We aim to reduce unnecessary delays while keeping diagnosis, repair and quality checks clear.' },
  { icon: '🛡️', title: 'Warranty Clarity', desc: 'The warranty period and coverage are confirmed for the selected part and repair before handover.' },
  { icon: '💎', title: 'Quality-Tested Options', desc: 'Available part grades are explained before repair so the option, price and applicable warranty are clear.' },
  { icon: '🤝', title: 'Customer First', desc: "From the moment you walk in to collection — your experience is our priority." },
];

export const ABOUT_MILESTONES = [
  { icon: '🔍', year: '01', title: 'Inspect', desc: 'Device condition and symptoms are recorded before any repair decision is made.' },
  { icon: '📊', year: '02', title: 'Diagnose', desc: 'The likely fault, repair route, expected turnaround and estimate are explained before approval.' },
  { icon: '🔧', year: '03', title: 'Repair', desc: 'Approved work is carried out with the appropriate tools and selected replacement part grade.' },
  { icon: '✅', year: '04', title: 'Quality Check', desc: 'Relevant device functions are tested after repair before the device is marked ready.' },
  { icon: '🚚', year: '05', title: 'Handover', desc: 'Collect in store or use eligible mobile pickup/delivery, with tracking updates available for supported jobs.' },
];

export const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'Oppo', 'Google Pixel', 'Nothing', 'Motorola', 'Asus', 'Dell', 'HP', 'Lenovo', 'MacBook'];

export const GALLERY_ITEMS = [
  { label: 'iPhone · Precision', rot: '-3deg', y: '0px' },
  { label: 'MacBook · Logic Board', rot: '3deg', y: '20px' },
  { label: 'Workshop', rot: '-2deg', y: '-10px' },
  { label: 'Android · Battery', rot: '4deg', y: '15px' },
  { label: 'Chip-Level', rot: '-3deg', y: '-5px' },
  { label: 'Every Brand', rot: '2deg', y: '10px' },
  { label: 'Display Repair', rot: '-4deg', y: '-15px' },
];
