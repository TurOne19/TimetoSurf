-- ====================================================
-- Time to Surf — Supabase Schema v2 (Admin Panel)
-- Выполни этот SQL в Supabase > SQL Editor
-- ====================================================

-- 1. Таблица отзывов (уже существует, не трогаем)
-- reviews: id, name, text, program, rating, approved, created_at

-- 2. Настройки сайта (key-value)
create table if not exists site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- RLS для настроек — только сервис может писать, все читают
alter table site_settings enable row level security;

create policy "Public can read settings"
  on site_settings for select using (true);

create policy "Service role can write settings"
  on site_settings for all using (true) with check (true);

-- 3. Смены лагеря
create table if not exists camp_sessions (
  id bigserial primary key,
  dates text not null,
  type_ru text not null,
  type_en text not null,
  type_et text not null,
  color text not null default '#1A6BAA',
  leaders text not null,
  hot boolean not null default false,
  detail text not null default 'surf',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table camp_sessions enable row level security;
create policy "Public can read sessions" on camp_sessions for select using (true);
create policy "Service role can write sessions" on camp_sessions for all using (true) with check (true);

-- 4. Фотографии галереи
create table if not exists gallery_photos (
  id bigserial primary key,
  url text not null,
  section text not null default 'water', -- water | team | moments | hero
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table gallery_photos enable row level security;
create policy "Public can read photos" on gallery_photos for select using (true);
create policy "Service role can write photos" on gallery_photos for all using (true) with check (true);

-- 5. Начальные настройки
insert into site_settings (key, value) values
  ('spots_taken', '4'),
  ('spots_total', '16'),
  ('next_session_date', '15.06'),
  ('price_3day', '190€'),
  ('price_5day', '265€'),
  ('schedule_year_label', 'Лето 2026'),
  ('admin_password_hash', 'surf2026admin')
on conflict (key) do nothing;

-- 6. Начальные смены
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
