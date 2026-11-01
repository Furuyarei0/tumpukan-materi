-- Migrasi 001: Tabel Web Push Subscriptions & Konfigurasi Notifikasi
-- Dijalankan manual oleh pemilik di SQL Editor Supabase Dashboard

-- 1. Buat tabel push_subscriptions untuk menyimpan langganan Web Push per perangkat admin
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Aktifkan Row Level Security (RLS)
alter table public.push_subscriptions enable row level security;

-- Izin akses tabel untuk user terautentikasi
grant all on public.push_subscriptions to authenticated;

-- Policy: Admin atau user terautentikasi dapat melihat dan mengelola langganan notifikasi miliknya
create policy "Admins can manage push subscriptions"
  on public.push_subscriptions
  for all
  to authenticated
  using (
    auth.uid() = user_id or auth.uid() in (select user_id from public.admins)
  )
  with check (
    auth.uid() = user_id or auth.uid() in (select user_id from public.admins)
  );

-- Index untuk mempercepat query saat mengirim push ke semua subscriber
create index if not exists idx_push_subscriptions_created_at
  on public.push_subscriptions (created_at desc);

-- Catatan untuk Webhook Pemanggil Edge Function:
-- Di Supabase Dashboard, buka: Database -> Webhooks -> "Create a new webhook"
-- 1. Name: notify_submission_webhook
-- 2. Table: materials
-- 3. Events: INSERT
-- 4. Type: Supabase Edge Functions
-- 5. Function: notify-submission
-- 6. Method: POST
