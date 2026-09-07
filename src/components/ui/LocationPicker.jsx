import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import styles from './LocationPicker.module.css';

const DEFAULT_CENTER = { lat: 8.1818771, lng: 77.4292565 };
const LEAFLET_VERSION = '1.9.4';
const LEAFLET_JS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
const LEAFLET_CSS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
let leafletPromise = null;

function parseGoogleMapsLink(value = '') {
  const text = String(value || '');
  const match = text.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i)
    || text.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i);
  if (!match) return null;
  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function toGoogleMapsLink(coords) {
  return `https://www.google.com/maps?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;
}

function loadLeaflet() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Map is unavailable'));
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-ihub-leaflet]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      link.dataset.ihubLeaflet = 'true';
      document.head.appendChild(link);
    }

    const existing = document.querySelector('script[data-ihub-leaflet]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.L), { once: true });
      existing.addEventListener('error', () => reject(new Error('Could not load map')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.dataset.ihubLeaflet = 'true';
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('Could not load map'));
    document.body.appendChild(script);
  });

  return leafletPromise;
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location is not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => reject(new Error('Allow location access to place the pin at your current location.')),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  });
}

export default function LocationPicker({ value = '', onChange, label = 'Pickup location *' }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [coords, setCoords] = useState(() => parseGoogleMapsLink(value) || DEFAULT_CENTER);
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (!open || !mapElementRef.current) return undefined;
    let cancelled = false;
    setLoading(true);
    setMessage('Finding your current location…');

    const init = async () => {
      try {
        const L = await loadLeaflet();
        if (cancelled || !mapElementRef.current) return;

        let initial = parseGoogleMapsLink(value);
        if (!initial) {
          try {
            initial = await getCurrentPosition();
            if (!cancelled) setMessage('Current location found. Drag the red pin if needed.');
          } catch (error) {
            initial = DEFAULT_CENTER;
            if (!cancelled) setMessage(error.message || 'Drag the red pin to your pickup location.');
          }
        } else if (!cancelled) {
          setMessage('Drag the red pin if you want to adjust the selected location.');
        }

        if (cancelled) return;
        setCoords(initial);

        const map = L.map(mapElementRef.current, {
          zoomControl: true,
          attributionControl: true,
        }).setView([initial.lat, initial.lng], 17);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 20,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const pinIcon = L.divIcon({
          className: 'ihubLeafletPinWrap',
          html: '<div class="ihubLeafletPin"><span></span></div>',
          iconSize: [42, 50],
          iconAnchor: [21, 46],
        });

        const marker = L.marker([initial.lat, initial.lng], { draggable: true, icon: pinIcon }).addTo(map);
        const applyLatLng = latlng => setCoords({ lat: latlng.lat, lng: latlng.lng });
        marker.on('dragend', event => applyLatLng(event.target.getLatLng()));
        map.on('click', event => {
          marker.setLatLng(event.latlng);
          applyLatLng(event.latlng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        setLoading(false);
        setTimeout(() => map.invalidateSize(), 80);
      } catch (error) {
        if (!cancelled) {
          setLoading(false);
          setMessage(error.message || 'Could not load the map. Please try again.');
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [open, value]);

  const recenter = async () => {
    setMessage('Finding your current location…');
    try {
      const current = await getCurrentPosition();
      setCoords(current);
      markerRef.current?.setLatLng([current.lat, current.lng]);
      mapInstanceRef.current?.setView([current.lat, current.lng], 18, { animate: true });
      setMessage('Current location found. Drag the red pin if needed.');
    } catch (error) {
      setMessage(error.message || 'Could not get your current location.');
    }
  };

  const confirm = () => {
    onChange?.(toGoogleMapsLink(coords));
    setOpen(false);
  };

  return (
    <>
      <div className={styles.field}>
        <span>{label}</span>
        <div className={styles.locationInputWrap}>
          <button type="button" className={styles.locationInput} onClick={() => setOpen(true)}>
            <Icon name="pin" size={18} />
            <span className={value ? styles.locationValue : styles.locationPlaceholder}>
              {value || 'Choose current location on map'}
            </span>
          </button>
          <button type="button" className={styles.mapButton} onClick={() => setOpen(true)} aria-label="Choose pickup location on map">
            <Icon name="pin" size={19} />
          </button>
        </div>
        {value && <a className={styles.openLink} href={value} target="_blank" rel="noopener noreferrer">Open selected location in Google Maps ↗</a>}
      </div>

      {open && (
        <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Choose pickup location">
          <div className={styles.modal}>
            <div className={styles.modalHead}>
              <div>
                <span>Pickup location</span>
                <h3>Place the red pin</h3>
                <p>We start from your current location. Drag the pin or tap anywhere on the map to adjust it.</p>
              </div>
              <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close location picker">×</button>
            </div>

            <div className={styles.mapShell}>
              <div ref={mapElementRef} className={styles.map} />
              {loading && <div className={styles.mapLoading}><div className={styles.spinner} /><strong>Opening map…</strong></div>}
              <button type="button" className={styles.currentButton} onClick={recenter}><Icon name="target" size={17} />Use My Current Location</button>
            </div>

            <div className={styles.coordsRow}>
              <div><span>Latitude</span><strong>{coords.lat.toFixed(6)}</strong></div>
              <div><span>Longitude</span><strong>{coords.lng.toFixed(6)}</strong></div>
            </div>
            <p className={styles.message}>{message}</p>

            <div className={styles.actions}>
              <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
              <button type="button" className="btn-primary brand-grad" onClick={confirm}><Icon name="check" size={17} />Use This Location</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
