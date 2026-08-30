import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const META = {
  '/': ['Mobile Phone & Laptop Repair in Nagercoil | iHub', 'Professional iPhone, Android, MacBook, Windows laptop and tablet repair in Nagercoil with free pickup and delivery in eligible areas.'],
  '/services': ['Device Repair Services in Nagercoil | iHub', 'Explore iPhone, Android, laptop, tablet, water-damage, chip-level and data-recovery services from iHub Nagercoil.'],
  '/pricing': ['Repair Pricing in Nagercoil | iHub', 'View indicative repair pricing and request a diagnosis before approving any repair.'],
  '/pickup-delivery': ['Free Device Pickup & Delivery in Nagercoil | iHub', 'Schedule free doorstep pickup and return delivery for eligible phones, MacBooks, Windows laptops and tablets in Nagercoil service areas.'],
  '/sell-phone': ['Sell Your Used Phone in Nagercoil | iHub', 'Sell your used iPhone or Android phone to iHub Nagercoil. Submit device condition and photos, request an offer, then choose store handover or eligible pickup.'],
  '/booking': ['Book a Repair | iHub Nagercoil', 'Book a repair through the iHub Free Pickup & Delivery page for supported phones, laptops and tablets.'],
  '/about': ['About iHub Device Repair | Nagercoil', 'Learn about iHub device repair, our repair process, diagnostics, quality checks and customer-first service standards.'],
  '/contact': ['Contact iHub Nagercoil | Device Repair', 'Contact iHub Nagercoil for device repair, quotes, directions, WhatsApp support, pickup and delivery enquiries.'],
  '/privacy': ['Privacy Policy | iHub Nagercoil', 'Read how iHub handles website enquiries, booking information and repair-related customer information.'],
  '/repair-policy': ['Repair & Warranty Policy | iHub Nagercoil', 'Read iHub repair estimates, warranty, data, pickup, delivery and device collection terms.'],
};

function setMeta(selector, attr, value) {
  let node = document.querySelector(selector);
  if (!node) {
    node = document.createElement('meta');
    const match = selector.match(/meta\[(name|property)="([^"]+)"\]/);
    if (match) node.setAttribute(match[1], match[2]);
    document.head.appendChild(node);
  }
  node.setAttribute(attr, value);
}

export default function SeoManager() {
  const location = useLocation();
  useEffect(() => {
    const basePath = location.pathname;
    const known = Boolean(META[basePath]);
    const [title, description] = META[basePath] || ['iHub Device Repair | Nagercoil', 'Professional multi-brand device repair, booking, free pickup and delivery in Nagercoil.'];

    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="robots"]', 'content', !known ? 'noindex,nofollow' : 'index,follow');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${window.location.origin}${location.pathname}`;
    setMeta('meta[property="og:url"]', 'content', canonical.href);
  }, [location.pathname]);
  return null;
}
