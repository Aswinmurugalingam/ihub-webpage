const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

export const backendReady = Boolean(SUPABASE_URL && SUPABASE_KEY);

function headers(prefer = '') {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

function localRead(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function localWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* preview only */ }
}

export function makeReference(prefix = 'IH') {
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(-2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

export async function getUnavailableSlots(date, method = 'store') {
  if (!date) return [];
  if (backendReady) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/ihub_unavailable_slots`, {
      method: 'POST', headers: headers(), body: JSON.stringify({ p_date: date, p_method: method })
    });
    if (!res.ok) throw new Error('Could not load availability');
    return (await res.json()).map(r => r.appointment_time);
  }
  return localRead('ihub_bookings').filter(r => r.appointment_date === date && r.repair_method === method && r.status !== 'cancelled').map(r => r.appointment_time);
}

export async function createBooking(payload) {
  const trackingId = payload.tracking_id || makeReference(payload.repair_method === 'pickup' ? 'IH-PU' : 'IH-BK');
  const row = { ...payload, tracking_id: trackingId, status: 'requested', created_at: new Date().toISOString() };
  if (backendReady) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ihub_bookings`, { method: 'POST', headers: headers('return=minimal'), body: JSON.stringify(row) });
    if (!res.ok) throw new Error(await res.text() || 'Booking failed');
    return row;
  }
  const items = localRead('ihub_bookings'); items.push(row); localWrite('ihub_bookings', items);
  return row;
}

export async function createEnquiry(payload) {
  const reference = makeReference('IH-Q');
  const row = { ...payload, reference, created_at: new Date().toISOString() };
  if (backendReady) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ihub_enquiries`, { method: 'POST', headers: headers('return=minimal'), body: JSON.stringify(row) });
    if (!res.ok) throw new Error(await res.text() || 'Enquiry failed');
    return row;
  }
  if (WEB3FORMS_KEY) {
    const res = await fetch('https://api.web3forms.com/submit', { method:'POST', headers:{'Content-Type':'application/json', Accept:'application/json'}, body:JSON.stringify({ access_key:WEB3FORMS_KEY, subject:`iHub enquiry ${reference}`, from_name:'iHub Website', ...payload }) });
    const json = await res.json();
    if (!json.success) throw new Error('Enquiry failed');
    return row;
  }
  const items = localRead('ihub_enquiries'); items.push(row); localWrite('ihub_enquiries', items);
  return row;
}

function safeFileName(name = 'photo.jpg') {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'photo.jpg';
}

async function uploadSellPhoto(reference, slot, file) {
  if (!backendReady || !file) return file?.name ? `preview:${file.name}` : '';
  const original = safeFileName(file.name || `${slot}.jpg`);
  const ext = original.includes('.') ? original.split('.').pop() : 'jpg';
  const path = `${reference}/${slot}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/sell-phone-photos/${encodeURI(path)}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': file.type || 'image/jpeg',
      'x-upsert': 'false',
    },
    body: file,
  });
  if (!res.ok) throw new Error(await res.text() || 'Could not upload device photos');
  return path;
}

export async function createSellRequest(payload, photoEntries = [], onProgress = () => {}) {
  const reference = payload.reference || makeReference('IH-SELL');
  const photoPaths = [];
  const validPhotos = photoEntries.filter(entry => entry?.file);
  const totalPhotos = validPhotos.length;

  onProgress({ percent: 12, phaseLabel: 'Preparing', message: 'Preparing your request and phone photos…' });

  for (let index = 0; index < validPhotos.length; index += 1) {
    const entry = validPhotos[index];
    const beforePercent = 15 + Math.round((index / Math.max(1, totalPhotos)) * 55);
    onProgress({
      percent: beforePercent,
      phaseLabel: 'Uploading photos',
      message: `Uploading photo ${index + 1} of ${totalPhotos}…`,
      current: index + 1,
      total: totalPhotos,
    });
    const path = await uploadSellPhoto(reference, entry.slot || `photo-${photoPaths.length + 1}`, entry.file);
    if (path) photoPaths.push(path);
    const afterPercent = 15 + Math.round(((index + 1) / Math.max(1, totalPhotos)) * 55);
    onProgress({
      percent: afterPercent,
      phaseLabel: 'Uploading photos',
      message: `Uploaded ${index + 1} of ${totalPhotos} phone photos`,
      current: index + 1,
      total: totalPhotos,
    });
  }

  onProgress({ percent: 78, phaseLabel: 'Saving request', message: 'Saving your phone and contact details…' });

  const row = {
    ...payload,
    reference,
    photo_paths: photoPaths,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  if (backendReady) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ihub_sell_requests`, {
      method: 'POST',
      headers: headers('return=minimal'),
      body: JSON.stringify(row),
    });
    if (!res.ok) throw new Error(await res.text() || 'Sell request could not be submitted');
    onProgress({ percent: 96, phaseLabel: 'Finalising', message: 'Finalising your Sell Phone request…' });
    return row;
  }

  const items = localRead('ihub_sell_requests');
  items.push({
    ...row,
    photo_paths: photoEntries.filter(x => x?.file).map(x => `preview:${x.slot}:${x.file.name}`),
  });
  localWrite('ihub_sell_requests', items);
  onProgress({ percent: 96, phaseLabel: 'Finalising', message: 'Finalising your Sell Phone request…' });
  return row;
}
