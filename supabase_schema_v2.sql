-- ====================================================
-- Time to Surf — Supabase Schema v2 FIXED
-- Выполни ВЕСЬ этот SQL в Supabase > SQL Editor
-- ====================================================

-- ── Таблица отзывов ──────────────────────────────────
create table if not exists reviews (
  id bigserial primary key,
  name text not null,
  text text not null,
  program text,
  rating int not null default 5 check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz default now()
);

alter table reviews enable row level security;

drop policy if exists "Public can read approved reviews" on reviews;
drop policy if exists "Anyone can insert review" on reviews;
drop policy if exists "Anyone can read reviews" on reviews;
drop policy if exists "Anyone can update reviews" on reviews;
drop policy if exists "Anyone can delete reviews" on reviews;

-- Все могут читать, писать, обновлять, удалять (anon включительно)
create policy "reviews_select" on reviews for select using (true);
create policy "reviews_insert" on reviews for insert with check (true);
create policy "reviews_update" on reviews for update using (true) with check (true);
create policy "reviews_delete" on reviews for delete using (true);

-- ── Настройки сайта ───────────────────────────────────
create table if not exists site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;

drop policy if exists "Public can read settings" on site_settings;
drop policy if exists "Service role can write settings" on site_settings;
drop policy if exists "settings_select" on site_settings;
drop policy if exists "settings_insert" on site_settings;
drop policy if exists "settings_update" on site_settings;
drop policy if exists "settings_upsert" on site_settings;

create policy "settings_select" on site_settings for select using (true);
create policy "settings_insert" on site_settings for insert with check (true);
create policy "settings_update" on site_settings for update using (true) with check (true);
create policy "settings_delete" on site_settings for delete using (true);

-- ── Смены лагеря ─────────────────────────────────────
create table if not exists camp_sessions (
  id bigserial primary key,
  dates text not null,
  type_ru text not null,
  type_en text not null,
  type_et text not null,
  color text not null default '#1A6BAA',
  leaders text not null default '',
  hot boolean not null default false,
  detail text not null default 'surf',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table camp_sessions enable row level security;

drop policy if exists "Public can read sessions" on camp_sessions;
drop policy if exists "Service role can write sessions" on camp_sessions;
drop policy if exists "sessions_select" on camp_sessions;
drop policy if exists "sessions_insert" on camp_sessions;
drop policy if exists "sessions_update" on camp_sessions;
drop policy if exists "sessions_delete" on camp_sessions;

create policy "sessions_select" on camp_sessions for select using (true);
create policy "sessions_insert" on camp_sessions for insert with check (true);
create policy "sessions_update" on camp_sessions for update using (true) with check (true);
create policy "sessions_delete" on camp_sessions for delete using (true);

-- ── Галерея фото ──────────────────────────────────────
create table if not exists gallery_photos (
  id bigserial primary key,
  url text not null,
  section text not null default 'moments',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table gallery_photos enable row level security;

drop policy if exists "Public can read photos" on gallery_photos;
drop policy if exists "Service role can write photos" on gallery_photos;
drop policy if exists "photos_select" on gallery_photos;
drop policy if exists "photos_insert" on gallery_photos;
drop policy if exists "photos_update" on gallery_photos;
drop policy if exists "photos_delete" on gallery_photos;

create policy "photos_select" on gallery_photos for select using (true);
create policy "photos_insert" on gallery_photos for insert with check (true);
create policy "photos_update" on gallery_photos for update using (true) with check (true);
create policy "photos_delete" on gallery_photos for delete using (true);

-- ── Начальные данные ─────────────────────────────────
insert into site_settings (key, value) values
  ('spots_taken', '4'),
  ('spots_total', '16'),
  ('next_session_date', '15.06'),
  ('price_3day', '190€'),
  ('price_4day', '235€'),
  ('price_5day', '265€'),
  ('schedule_year_label', 'Лето 2026')
on conflict (key) do nothing;

insert into camp_sessions (dates, type_ru, type_en, type_et, color, leaders, hot, detail, sort_order) values
  ('15.06 - 19.06.2026', 'СЕРФИНГ + КИНО', 'SURF + CINEMA', 'SURF + KINO', '#7C3AED', 'Наташа К. + Даша', true, 'kino', 1),
  ('29.06 - 03.07.2026', 'СЕРФИНГ + КИНО', 'SURF + CINEMA', 'SURF + KINO', '#7C3AED', 'Наташа К. + Даша', false, 'kino', 2),
  ('06.07 - 10.07.2026', 'СЕРФИНГ ЛАГЕРЬ', 'SURF CAMP', 'SURFI LAAGER', '#1A6BAA', 'Надежда + Григорий', false, 'surf', 3),
  ('13.07 - 17.07.2026', 'СЕРФИНГ + ПОХОД', 'SURF + HIKE', 'SURF + MATK', '#16A34A', 'Виталий + Григорий', false, 'pohod', 4),
  ('20.07 - 24.07.2026', 'СЕРФИНГ ЛАГЕРЬ', 'SURF CAMP', 'SURFI LAAGER', '#1A6BAA', 'Надежда + Ксения', false, 'surf', 5),
  ('27.07 - 30.07.2026', 'СЕРФИНГ (4 ДНЯ)', 'SURF (4 DAYS)', 'SURF (4 PAEVA)', '#1A6BAA', 'TBD', false, 'surf', 6),
  ('03.08 - 07.08.2026', 'СЕРФИНГ ЛАГЕРЬ', 'SURF CAMP', 'SURFI LAAGER', '#1A6BAA', 'Даша + ...', false, 'surf', 7),
  ('10.08 - 14.08.2026', 'СЕРФИНГ ЛАГЕРЬ', 'SURF CAMP', 'SURFI LAAGER', '#1A6BAA', 'Надежда + ...', false, 'surf', 8),
  ('17.08 - 21.08.2026', 'СЕРФИНГ + ПОХОД', 'SURF + HIKE', 'SURF + MATK', '#16A34A', 'Виталий + ...', false, 'pohod', 9)
on conflict do nothing;
