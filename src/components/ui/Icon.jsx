const aliases = {
  '📱':'phone','🤖':'phone','💻':'laptop','🖥️':'monitor','📟':'tablet','⌚':'watch','💧':'droplet','⚙️':'chip','💾':'database',
  '🛡️':'shield','🏅':'award','⏱️':'clock','💰':'wallet','😊':'users','🚚':'truck','📅':'calendar','🔍':'search','🔧':'tool','✅':'check',
  '⚡':'bolt','🔋':'battery','👁️':'eye','🔊':'speaker','📸':'camera','🔑':'key','💡':'display','⌨️':'keyboard','❄️':'snow','🔬':'search',
  '📶':'signal','📡':'signal','🧠':'chip','🎮':'chip','📲':'phone','👆':'layers','🍎':'phone','📷':'camera','🔒':'shield','📊':'chart','🎯':'target',
  '🤝':'handshake','💎':'diamond','🚀':'rocket','⭐':'star','❓':'help','📍':'pin','📞':'phoneCall','💬':'message','📧':'mail','🕐':'clock'
};

const paths = {
  phone: <><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></>,
  laptop: <><rect x="4" y="4" width="16" height="11" rx="2"/><path d="M2 19h20M8 19l1-4h6l1 4"/></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></>,
  tablet: <><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/></>,
  watch: <><rect x="7" y="6" width="10" height="12" rx="3"/><path d="M9 6V2h6v4M9 18v4h6v-4"/></>,
  droplet: <path d="M12 2s6 6.4 6 11a6 6 0 1 1-12 0c0-4.6 6-11 6-11z"/>,
  chip: <><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/></>,
  database: <><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></>,
  shield: <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z"/>,
  award: <><circle cx="12" cy="8" r="5"/><path d="M8.5 12l-2 9 5.5-3 5.5 3-2-9"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  wallet: <><path d="M3 7a3 3 0 0 1 3-3h12v16H6a3 3 0 0 1-3-3V7z"/><path d="M15 10h6v5h-6a2.5 2.5 0 0 1 0-5z"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></>,
  tool: <path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.6 7 6.3 4.7a4 4 0 0 0 5 5L4 17l3 3 7.7-7.3a4 4 0 0 0 0-6.4z"/>,
  check: <><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></>,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>,
  battery: <><rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4M7 12h8"/></>,
  eye: <><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2"/></>,
  speaker: <><path d="M5 9v6h4l5 4V5L9 9H5zM18 9a4 4 0 0 1 0 6M20 6a8 8 0 0 1 0 12"/></>,
  camera: <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M8 6l2-3h4l2 3"/><circle cx="12" cy="12" r="3"/></>,
  key: <><circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M15 8l2 2M17 6l2 2"/></>,
  display: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 17h8"/></>,
  keyboard: <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M6 10h1M10 10h1M14 10h1M18 10h1M6 14h9"/></>,
  snow: <><path d="M12 2v20M4 7l16 10M20 7L4 17"/><path d="M9 4l3 3 3-3M9 20l3-3 3 3"/></>,
  signal: <><path d="M5 16h2v4H5zM11 11h2v9h-2zM17 6h2v14h-2z"/></>,
  layers: <><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5"/></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
  handshake: <path d="M8 12l3 3a2 2 0 0 0 3 0l5-5M2 12l5-5 4 2 3-2 8 5M6 16l2 2M10 18l2 2M14 17l2 2"/>,
  diamond: <><path d="M3 9l4-5h10l4 5-9 12L3 9z"/><path d="M3 9h18M8 4l4 5 4-5"/></>,
  rocket: <><path d="M14 4c3-2 6-2 6-2s0 3-2 6l-7 7-5-5 8-6z"/><path d="M8 12l-4 1-2 4 6-1M12 16l-1 4-4 2 1-6"/></>,
  star: <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z"/>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.8 2.8 0 1 1 4.1 2.5c-1 .5-1.6 1-1.6 2.5M12 18h.01"/></>,
  pin: <><path d="M12 22s7-6 7-13a7 7 0 1 0-14 0c0 7 7 13 7 13z"/><circle cx="12" cy="9" r="2"/></>,
  phoneCall: <path d="M5 3l4 4-2 3c2 4 4 6 8 8l3-2 4 4-2 2c-2 2-6 0-10-3S1 10 3 6l2-3z"/>,
  message: <><path d="M4 4h16v13H9l-5 4V4z"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  refresh: <><path d="M20 6v5h-5"/><path d="M19 11a8 8 0 1 0 1 5"/></>,
  inbox: <><path d="M4 4h16l2 11v5H2v-5L4 4z"/><path d="M2 15h5l2 3h6l2-3h5"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v3M21 12h-3M12 21v-3M3 12h3"/></>
};

export default function Icon({ name, size = 22, strokeWidth = 1.8, className = '' }) {
  const key = aliases[name] || name || 'tool';
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[key] || paths.tool}
    </svg>
  );
}
