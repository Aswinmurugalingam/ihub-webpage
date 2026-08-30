-- iHub public website data model: booking, pickup/delivery, slot availability and enquiries only.
-- Run this in the Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.ihub_bookings (
  id uuid primary key default gen_random_uuid(),
  tracking_id text unique not null, -- used internally as the booking reference
  repair_method text not null check (repair_method in ('store','pickup')),
  device_type text not null,
  device_model text,
  service text not null,
  appointment_date date not null,
  appointment_time text not null,
  customer_name text not null,
  phone text not null,
  email text,
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

create table if not exists public.ihub_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  name text not null,
  phone text not null,
  email text,
  device text,
  service text,
  description text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.ihub_bookings enable row level security;
alter table public.ihub_enquiries enable row level security;

-- Public visitors may submit forms, but may not read customer rows.
drop policy if exists "public insert bookings" on public.ihub_bookings;
create policy "public insert bookings" on public.ihub_bookings
for insert to anon
with check (
  status = 'requested'
  and appointment_date between current_date and (current_date + 30)
  and tracking_id ~ '^IH-(BK|PU)-[0-9]{6}-[A-Z0-9]{4}$'
);

drop policy if exists "public insert enquiries" on public.ihub_enquiries;
create policy "public insert enquiries" on public.ihub_enquiries
for insert to anon
with check (
  status = 'new'
  and reference ~ '^IH-Q-[0-9]{6}-[A-Z0-9]{4}$'
);

-- Return only occupied time slots for a date/method. No customer details are exposed.
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

-- Data quality constraints.
alter table public.ihub_bookings drop constraint if exists ihub_booking_customer_name_check;
alter table public.ihub_bookings add constraint ihub_booking_customer_name_check check (char_length(trim(customer_name)) between 2 and 100);
alter table public.ihub_bookings drop constraint if exists ihub_booking_phone_check;
alter table public.ihub_bookings add constraint ihub_booking_phone_check check (char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 10 and 15);
alter table public.ihub_bookings drop constraint if exists ihub_booking_service_check;
alter table public.ihub_bookings add constraint ihub_booking_service_check check (char_length(trim(service)) between 2 and 120);
alter table public.ihub_bookings drop constraint if exists ihub_booking_pickup_address_check;
alter table public.ihub_bookings add constraint ihub_booking_pickup_address_check check (
  repair_method <> 'pickup' or (
    char_length(trim(coalesce(address,''))) >= 5 and
    char_length(trim(coalesce(area,''))) >= 2 and
    char_length(regexp_replace(coalesce(pincode,''), '[^0-9]', '', 'g')) between 5 and 8
  )
);
alter table public.ihub_bookings drop constraint if exists ihub_booking_status_check;
alter table public.ihub_bookings add constraint ihub_booking_status_check check (status in ('requested','confirmed','collected','in_progress','completed','cancelled'));

alter table public.ihub_enquiries drop constraint if exists ihub_enquiry_name_check;
alter table public.ihub_enquiries add constraint ihub_enquiry_name_check check (char_length(trim(name)) between 2 and 100);
alter table public.ihub_enquiries drop constraint if exists ihub_enquiry_phone_check;
alter table public.ihub_enquiries add constraint ihub_enquiry_phone_check check (char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 10 and 15);
alter table public.ihub_enquiries drop constraint if exists ihub_enquiry_status_check;
alter table public.ihub_enquiries add constraint ihub_enquiry_status_check check (status in ('new','contacted','closed'));

grant usage on schema public to anon;
grant insert on public.ihub_bookings, public.ihub_enquiries to anon;
revoke select, update, delete on public.ihub_bookings, public.ihub_enquiries from anon;

-- Used-phone sell requests. Public visitors may submit a request but cannot read rows back.
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
  handover_method text not null default 'store',
  address text,
  area text,
  landmark text,
  pincode text,
  preferred_date date,
  preferred_time text,
  customer_name text not null,
  phone text not null,
  email text,
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
  and ownership_confirmed = true
  and terms_confirmed = true
  and reference ~ '^IH-SELL-[0-9]{6}-[A-Z0-9]{4}$'
);

alter table public.ihub_sell_requests drop constraint if exists ihub_sell_brand_check;
alter table public.ihub_sell_requests add constraint ihub_sell_brand_check check (char_length(trim(brand)) between 2 and 40);
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_model_check;
alter table public.ihub_sell_requests add constraint ihub_sell_model_check check (char_length(trim(model)) between 2 and 120);
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_phone_check;
alter table public.ihub_sell_requests add constraint ihub_sell_phone_check check (char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 10 and 15);
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
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_handover_check;
alter table public.ihub_sell_requests add constraint ihub_sell_handover_check check (handover_method in ('store','pickup'));
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_pickup_address_check;
alter table public.ihub_sell_requests add constraint ihub_sell_pickup_address_check check (
  handover_method <> 'pickup' or (
    char_length(trim(coalesce(address,''))) >= 5 and
    char_length(trim(coalesce(area,''))) >= 2 and
    char_length(regexp_replace(coalesce(pincode,''), '[^0-9]', '', 'g')) between 5 and 8
  )
);
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_status_check;
alter table public.ihub_sell_requests add constraint ihub_sell_status_check check (status in ('new','reviewing','offered','accepted','declined','completed','closed'));

grant insert on public.ihub_sell_requests to anon;
revoke select, update, delete on public.ihub_sell_requests from anon;

-- Private photo bucket. Website visitors may upload images for a sell request,
-- but anonymous visitors cannot browse/read the bucket.
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
