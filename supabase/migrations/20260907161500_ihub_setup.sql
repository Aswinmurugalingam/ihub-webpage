-- iHub public website backend setup
-- Fresh Supabase project setup for:
-- 1) Free Pickup / Repair requests
-- 2) Contact / Repair quote requests
-- 3) Sell Phone requests + private photos
-- 4) Admin + customer email notification logging
-- Run this entire file in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- ============================================================
-- FREE PICKUP / REPAIR BOOKINGS
-- ============================================================
create table if not exists public.ihub_bookings (
  id uuid primary key default gen_random_uuid(),
  tracking_id text unique not null,
  repair_method text not null check (repair_method in ('store','pickup')),
  device_type text not null,
  device_model text,
  service text not null,
  appointment_date date not null,
  appointment_time text not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  address text,
  area text,
  landmark text,
  pincode text,
  map_link text,
  notes text,
  status text not null default 'requested',
  created_at timestamptz not null default now()
);

create index if not exists ihub_bookings_slot_idx
  on public.ihub_bookings(appointment_date, appointment_time, repair_method);

create unique index if not exists ihub_unique_active_slot
  on public.ihub_bookings(appointment_date, appointment_time, repair_method)
  where status <> 'cancelled';

alter table public.ihub_bookings enable row level security;

drop policy if exists "public insert bookings" on public.ihub_bookings;
create policy "public insert bookings" on public.ihub_bookings
for insert to anon
with check (
  status = 'requested'
  and appointment_date between current_date and (current_date + 30)
  and tracking_id ~ '^IH-(BK|PU)-[0-9]{6}-[A-Z0-9]{4}$'
  and char_length(trim(email)) between 5 and 254
  and position('@' in email) > 1
);

create or replace function public.ihub_unavailable_slots(p_date date, p_method text)
returns table (appointment_time text)
language sql
security definer
set search_path = public
as $$
  select b.appointment_time
  from public.ihub_bookings b
  where b.appointment_date = p_date
    and b.repair_method = p_method
    and b.status <> 'cancelled';
$$;
revoke all on function public.ihub_unavailable_slots(date,text) from public;
grant execute on function public.ihub_unavailable_slots(date,text) to anon;

alter table public.ihub_bookings drop constraint if exists ihub_booking_customer_name_check;
alter table public.ihub_bookings add constraint ihub_booking_customer_name_check check (char_length(trim(customer_name)) between 2 and 100);
alter table public.ihub_bookings drop constraint if exists ihub_booking_phone_check;
alter table public.ihub_bookings add constraint ihub_booking_phone_check check (char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 10 and 15);
alter table public.ihub_bookings drop constraint if exists ihub_booking_email_check;
alter table public.ihub_bookings add constraint ihub_booking_email_check check (char_length(trim(email)) between 5 and 254 and position('@' in email) > 1);
alter table public.ihub_bookings drop constraint if exists ihub_booking_service_check;
alter table public.ihub_bookings add constraint ihub_booking_service_check check (char_length(trim(service)) between 2 and 120);
alter table public.ihub_bookings drop constraint if exists ihub_booking_pickup_address_check;
alter table public.ihub_bookings add constraint ihub_booking_pickup_address_check check (
  repair_method <> 'pickup' or (
    char_length(trim(coalesce(address,''))) >= 5 and
    char_length(trim(coalesce(area,''))) >= 2 and
    char_length(regexp_replace(coalesce(pincode,''), '[^0-9]', '', 'g')) between 5 and 8 and
    char_length(trim(coalesce(map_link,''))) >= 20
  )
);
alter table public.ihub_bookings drop constraint if exists ihub_booking_status_check;
alter table public.ihub_bookings add constraint ihub_booking_status_check check (status in ('requested','confirmed','collected','in_progress','completed','cancelled'));

-- ============================================================
-- CONTACT / REPAIR QUOTE ENQUIRIES
-- ============================================================
create table if not exists public.ihub_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  name text not null,
  phone text not null,
  email text not null,
  device text,
  service text,
  description text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.ihub_enquiries enable row level security;

drop policy if exists "public insert enquiries" on public.ihub_enquiries;
create policy "public insert enquiries" on public.ihub_enquiries
for insert to anon
with check (
  status = 'new'
  and reference ~ '^IH-Q-[0-9]{6}-[A-Z0-9]{4}$'
  and char_length(trim(email)) between 5 and 254
  and position('@' in email) > 1
);

alter table public.ihub_enquiries drop constraint if exists ihub_enquiry_name_check;
alter table public.ihub_enquiries add constraint ihub_enquiry_name_check check (char_length(trim(name)) between 2 and 100);
alter table public.ihub_enquiries drop constraint if exists ihub_enquiry_phone_check;
alter table public.ihub_enquiries add constraint ihub_enquiry_phone_check check (char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 10 and 15);
alter table public.ihub_enquiries drop constraint if exists ihub_enquiry_email_check;
alter table public.ihub_enquiries add constraint ihub_enquiry_email_check check (char_length(trim(email)) between 5 and 254 and position('@' in email) > 1);
alter table public.ihub_enquiries drop constraint if exists ihub_enquiry_status_check;
alter table public.ihub_enquiries add constraint ihub_enquiry_status_check check (status in ('new','contacted','closed'));

-- ============================================================
-- USED PHONE SELL REQUESTS
-- Pickup is the only handover method in the website UI.
-- ============================================================
create table if not exists public.ihub_sell_requests (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  brand text not null,
  model text not null,
  storage text not null,
  color text not null,
  purchase_year integer,
  battery_health integer,
  screen_condition text not null,
  body_condition text not null,
  functions jsonb not null default '{}'::jsonb,
  repaired_before text not null default 'no',
  repair_details text,
  liquid_damage text not null default 'no',
  switches_on text not null default 'yes',
  account_lock text not null default 'no',
  financed text not null default 'no',
  ownership_confirmed boolean not null default false,
  terms_confirmed boolean not null default false,
  accessories text[] not null default '{}',
  handover_method text not null default 'pickup' check (handover_method = 'pickup'),
  address text not null,
  area text not null,
  landmark text,
  pincode text not null,
  map_link text not null,
  preferred_date date,
  preferred_time text,
  customer_name text not null,
  phone text not null,
  email text not null,
  notes text,
  photo_paths text[] not null default '{}',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.ihub_sell_requests enable row level security;

drop policy if exists "public insert sell requests" on public.ihub_sell_requests;
create policy "public insert sell requests" on public.ihub_sell_requests
for insert to anon
with check (
  status = 'new'
  and handover_method = 'pickup'
  and ownership_confirmed = true
  and terms_confirmed = true
  and reference ~ '^IH-SELL-[0-9]{6}-[A-Z0-9]{4}$'
  and char_length(trim(email)) between 5 and 254
  and position('@' in email) > 1
  and char_length(trim(map_link)) >= 20
);

alter table public.ihub_sell_requests drop constraint if exists ihub_sell_brand_check;
alter table public.ihub_sell_requests add constraint ihub_sell_brand_check check (char_length(trim(brand)) between 2 and 40);
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_model_check;
alter table public.ihub_sell_requests add constraint ihub_sell_model_check check (char_length(trim(model)) between 2 and 120);
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_phone_check;
alter table public.ihub_sell_requests add constraint ihub_sell_phone_check check (char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 10 and 15);
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_email_check;
alter table public.ihub_sell_requests add constraint ihub_sell_email_check check (char_length(trim(email)) between 5 and 254 and position('@' in email) > 1);
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_battery_check;
alter table public.ihub_sell_requests add constraint ihub_sell_battery_check check (battery_health is null or battery_health between 1 and 100);
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_year_check;
alter table public.ihub_sell_requests add constraint ihub_sell_year_check check (purchase_year is null or purchase_year between 2010 and 2030);
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_repaired_check;
alter table public.ihub_sell_requests add constraint ihub_sell_repaired_check check (repaired_before in ('no','yes','not sure'));
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_liquid_check;
alter table public.ihub_sell_requests add constraint ihub_sell_liquid_check check (liquid_damage in ('no','yes','not sure'));
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_power_check;
alter table public.ihub_sell_requests add constraint ihub_sell_power_check check (switches_on in ('yes','no','sometimes'));
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_lock_check;
alter table public.ihub_sell_requests add constraint ihub_sell_lock_check check (account_lock in ('no','yes','not sure'));
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_finance_check;
alter table public.ihub_sell_requests add constraint ihub_sell_finance_check check (financed in ('no','yes','not sure'));
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_pickup_address_check;
alter table public.ihub_sell_requests add constraint ihub_sell_pickup_address_check check (
  char_length(trim(address)) >= 5 and
  char_length(trim(area)) >= 2 and
  char_length(regexp_replace(pincode, '[^0-9]', '', 'g')) between 5 and 8 and
  char_length(trim(map_link)) >= 20
);
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_status_check;
alter table public.ihub_sell_requests add constraint ihub_sell_status_check check (status in ('new','reviewing','offered','accepted','declined','completed','closed'));

-- Private Sell Phone photo bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sell-phone-photos',
  'sell-phone-photos',
  false,
  8388608,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public upload sell phone photos" on storage.objects;
create policy "public upload sell phone photos" on storage.objects
for insert to anon
with check (
  bucket_id = 'sell-phone-photos'
  and (storage.foldername(name))[1] ~ '^IH-SELL-[0-9]{6}-[A-Z0-9]{4}$'
);

-- ============================================================
-- EMAIL DELIVERY LOG
-- One row per recipient prevents duplicate admin/customer emails on retries.
-- ============================================================
create table if not exists public.ihub_email_notifications (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (request_type in ('booking','enquiry','sell')),
  reference text not null,
  message_kind text not null check (message_kind in ('admin','customer')),
  recipient text not null,
  provider text not null default 'resend',
  provider_id text,
  sent_at timestamptz not null default now()
);

drop index if exists public.ihub_email_notifications_request_reference_idx;
drop index if exists public.ihub_email_notifications_request_reference_recipient_idx;
create unique index if not exists ihub_email_notifications_request_reference_kind_idx
  on public.ihub_email_notifications(request_type, reference, message_kind);

alter table public.ihub_email_notifications enable row level security;
revoke all on public.ihub_email_notifications from anon, authenticated;

-- ============================================================
-- PUBLIC INSERT PERMISSIONS ONLY
-- ============================================================
grant usage on schema public to anon;
grant insert on public.ihub_bookings, public.ihub_enquiries, public.ihub_sell_requests to anon;
revoke select, update, delete on public.ihub_bookings, public.ihub_enquiries, public.ihub_sell_requests from anon;
