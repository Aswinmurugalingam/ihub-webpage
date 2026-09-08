-- iHub Phase 3 production hardening
-- Adds server-side anti-spam guards, tighter field limits, protected event logs,
-- Edge Function rate-limit storage, and stricter Sell Phone upload paths.

-- ============================================================
-- SAFE MAXIMUM LENGTH / SHAPE CONSTRAINTS
-- NOT VALID avoids blocking deployment because of any old test rows; PostgreSQL still enforces these checks on every new/updated row.
-- ============================================================
alter table public.ihub_bookings drop constraint if exists ihub_booking_device_type_length_check;
alter table public.ihub_bookings add constraint ihub_booking_device_type_length_check
  check (char_length(trim(device_type)) between 2 and 50) not valid;
alter table public.ihub_bookings drop constraint if exists ihub_booking_device_model_length_check;
alter table public.ihub_bookings add constraint ihub_booking_device_model_length_check
  check (device_model is null or char_length(trim(device_model)) between 2 and 120) not valid;
alter table public.ihub_bookings drop constraint if exists ihub_booking_appointment_time_length_check;
alter table public.ihub_bookings add constraint ihub_booking_appointment_time_length_check
  check (char_length(trim(appointment_time)) between 1 and 50) not valid;
alter table public.ihub_bookings drop constraint if exists ihub_booking_address_length_check;
alter table public.ihub_bookings add constraint ihub_booking_address_length_check
  check (address is null or char_length(address) <= 300) not valid;
alter table public.ihub_bookings drop constraint if exists ihub_booking_area_length_check;
alter table public.ihub_bookings add constraint ihub_booking_area_length_check
  check (area is null or char_length(area) <= 120) not valid;
alter table public.ihub_bookings drop constraint if exists ihub_booking_landmark_length_check;
alter table public.ihub_bookings add constraint ihub_booking_landmark_length_check
  check (landmark is null or char_length(landmark) <= 200) not valid;
alter table public.ihub_bookings drop constraint if exists ihub_booking_map_length_check;
alter table public.ihub_bookings add constraint ihub_booking_map_length_check
  check (map_link is null or char_length(map_link) <= 500) not valid;
alter table public.ihub_bookings drop constraint if exists ihub_booking_notes_length_check;
alter table public.ihub_bookings add constraint ihub_booking_notes_length_check
  check (notes is null or char_length(notes) <= 2000) not valid;

alter table public.ihub_enquiries drop constraint if exists ihub_enquiry_device_length_check;
alter table public.ihub_enquiries add constraint ihub_enquiry_device_length_check
  check (device is null or char_length(device) <= 150) not valid;
alter table public.ihub_enquiries drop constraint if exists ihub_enquiry_service_length_check;
alter table public.ihub_enquiries add constraint ihub_enquiry_service_length_check
  check (service is null or char_length(service) <= 120) not valid;
alter table public.ihub_enquiries drop constraint if exists ihub_enquiry_description_length_check;
alter table public.ihub_enquiries add constraint ihub_enquiry_description_length_check
  check (description is null or char_length(description) <= 3000) not valid;

alter table public.ihub_sell_requests drop constraint if exists ihub_sell_storage_length_check;
alter table public.ihub_sell_requests add constraint ihub_sell_storage_length_check
  check (char_length(trim(storage)) between 2 and 40) not valid;
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_color_length_check;
alter table public.ihub_sell_requests add constraint ihub_sell_color_length_check
  check (char_length(trim(color)) between 2 and 80) not valid;
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_repair_details_length_check;
alter table public.ihub_sell_requests add constraint ihub_sell_repair_details_length_check
  check (repair_details is null or char_length(repair_details) <= 1000) not valid;
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_address_length_check;
alter table public.ihub_sell_requests add constraint ihub_sell_address_length_check
  check (char_length(address) <= 300) not valid;
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_area_length_check;
alter table public.ihub_sell_requests add constraint ihub_sell_area_length_check
  check (char_length(area) <= 120) not valid;
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_landmark_length_check;
alter table public.ihub_sell_requests add constraint ihub_sell_landmark_length_check
  check (landmark is null or char_length(landmark) <= 200) not valid;
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_map_length_check;
alter table public.ihub_sell_requests add constraint ihub_sell_map_length_check
  check (char_length(map_link) between 20 and 500) not valid;
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_preferred_time_length_check;
alter table public.ihub_sell_requests add constraint ihub_sell_preferred_time_length_check
  check (preferred_time is null or char_length(preferred_time) <= 60) not valid;
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_notes_length_check;
alter table public.ihub_sell_requests add constraint ihub_sell_notes_length_check
  check (notes is null or char_length(notes) <= 2000) not valid;
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_functions_shape_check;
alter table public.ihub_sell_requests add constraint ihub_sell_functions_shape_check
  check (jsonb_typeof(functions) = 'object') not valid;
alter table public.ihub_sell_requests drop constraint if exists ihub_sell_photo_count_check;
alter table public.ihub_sell_requests add constraint ihub_sell_photo_count_check
  check (coalesce(array_length(photo_paths, 1), 0) <= 6) not valid;

-- ============================================================
-- SERVER-SIDE SUBMISSION RATE GUARD
-- Same customer identity can submit up to 4 requests in 10 minutes and
-- 20 requests in 24 hours per form type. This is intentionally lenient
-- enough for genuine retries while blocking basic automated flooding.
-- ============================================================
create or replace function public.ihub_submission_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  email_key text := lower(trim(coalesce(new.email, '')));
  phone_key text := regexp_replace(coalesce(new.phone, ''), '[^0-9]', '', 'g');
  recent_count integer := 0;
  daily_count integer := 0;
begin
  execute format(
    'select count(*) from public.%I where created_at >= now() - interval ''10 minutes'' and (lower(trim(email)) = $1 or regexp_replace(phone, ''[^0-9]'', '''', ''g'') = $2)',
    tg_table_name
  ) into recent_count using email_key, phone_key;

  if recent_count >= 4 then
    raise exception using
      errcode = 'P0001',
      message = 'Too many requests. Please wait a few minutes before submitting again.';
  end if;

  execute format(
    'select count(*) from public.%I where created_at >= now() - interval ''24 hours'' and (lower(trim(email)) = $1 or regexp_replace(phone, ''[^0-9]'', '''', ''g'') = $2)',
    tg_table_name
  ) into daily_count using email_key, phone_key;

  if daily_count >= 20 then
    raise exception using
      errcode = 'P0001',
      message = 'Daily request limit reached. Please contact iHub directly if you need help.';
  end if;

  return new;
end;
$$;

revoke all on function public.ihub_submission_guard() from public;

DROP TRIGGER IF EXISTS ihub_bookings_submission_guard ON public.ihub_bookings;
CREATE TRIGGER ihub_bookings_submission_guard
before insert on public.ihub_bookings
for each row execute function public.ihub_submission_guard();

DROP TRIGGER IF EXISTS ihub_enquiries_submission_guard ON public.ihub_enquiries;
CREATE TRIGGER ihub_enquiries_submission_guard
before insert on public.ihub_enquiries
for each row execute function public.ihub_submission_guard();

DROP TRIGGER IF EXISTS ihub_sell_submission_guard ON public.ihub_sell_requests;
CREATE TRIGGER ihub_sell_submission_guard
before insert on public.ihub_sell_requests
for each row execute function public.ihub_submission_guard();

-- ============================================================
-- EDGE FUNCTION RATE LIMIT + ERROR/EVENT LOGS
-- Service-role only. Browser users cannot read or write these tables.
-- ============================================================
create table if not exists public.ihub_edge_rate_limits (
  id bigint generated by default as identity primary key,
  key_hash text not null check (char_length(key_hash) = 64),
  action text not null check (char_length(action) between 1 and 80),
  created_at timestamptz not null default now()
);

create index if not exists ihub_edge_rate_limits_lookup_idx
  on public.ihub_edge_rate_limits(key_hash, action, created_at desc);
create index if not exists ihub_edge_rate_limits_created_idx
  on public.ihub_edge_rate_limits(created_at);

alter table public.ihub_edge_rate_limits enable row level security;
revoke all on public.ihub_edge_rate_limits from anon, authenticated;

create table if not exists public.ihub_system_events (
  id bigint generated by default as identity primary key,
  level text not null default 'warn' check (level in ('info','warn','error')),
  event text not null check (char_length(event) between 1 and 120),
  request_type text check (request_type is null or request_type in ('booking','enquiry','sell')),
  reference text,
  message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ihub_system_events_created_idx
  on public.ihub_system_events(created_at desc);
create index if not exists ihub_system_events_reference_idx
  on public.ihub_system_events(reference)
  where reference is not null;

alter table public.ihub_system_events enable row level security;
revoke all on public.ihub_system_events from anon, authenticated;

-- ============================================================
-- STRICT SELL PHONE STORAGE PATHS
-- Keeps the existing private bucket and existing upload flow, but only permits
-- the six known photo slots and approved file extensions.
-- ============================================================
drop policy if exists "public upload sell phone photos" on storage.objects;
create policy "public upload sell phone photos" on storage.objects
for insert to anon
with check (
  bucket_id = 'sell-phone-photos'
  and name ~ '^IH-SELL-[0-9]{6}-[A-Z0-9]{4}/(front|back|left|right|screen|about)\.(jpg|jpeg|png|webp)$'
);
