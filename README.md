# iHub Repair Website

React + Vite website for iHub Nagercoil.

## Current customer features

- Responsive animated home page
- Repair service pages
- Pricing guide
- About and Contact
- Online repair booking
- Free pickup & delivery option for eligible iPhone and Android repairs
- WhatsApp contact actions
- Privacy and Repair/Warranty policy pages
- Responsive full-width desktop layout and mobile sticky actions

Tracking, price-estimator, and staff/admin portal pages are intentionally not included in this version.

## Run locally

```cmd
npm install
npm run dev
```

## Supabase (optional)

Copy `.env.example` to `.env` and fill in:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WEB3FORMS_ACCESS_KEY=
```

Run `supabase/ihub_setup.sql` in the Supabase SQL editor if you want shared live booking availability and enquiry storage. Without Supabase, the site still runs in local preview mode.

## Main routes

- `/`
- `/services`
- `/services/:service-slug`
- `/pricing`
- `/pickup-delivery`
- `/booking`
- `/about`
- `/contact`
- `/privacy`
- `/repair-policy`
