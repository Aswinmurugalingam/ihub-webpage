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
