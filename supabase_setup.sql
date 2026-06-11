-- Time to Surf full Supabase setup
-- Paste this whole file into Supabase SQL Editor after removing old tables.

drop table if exists reviews cascade;
drop table if exists gallery_photos cascade;
drop table if exists camp_sessions cascade;
drop table if exists site_settings cascade;

create table site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table camp_sessions (
  id bigserial primary key,
  dates text not null,
  type_ru text not null,
  type_en text not null,
  type_et text not null,
  color text not null default '#0e7490',
  leaders text not null default '',
  hot boolean not null default false,
  detail text not null default 'surf',
  sort_order int not null default 0,
  spots_left int,
  capacity int,
  created_at timestamptz not null default now()
);

create table gallery_photos (
  id bigserial primary key,
  url text not null,
  section text not null default 'moments',
  sort_order int not null default 0,
  alt_ru text not null default '',
  alt_en text not null default '',
  alt_et text not null default '',
  created_at timestamptz not null default now()
);

create table reviews (
  id bigserial primary key,
  name text not null,
  text text not null,
  program text,
  rating int not null default 5 check (rating >= 1 and rating <= 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table site_settings enable row level security;
alter table camp_sessions enable row level security;
alter table gallery_photos enable row level security;
alter table reviews enable row level security;

create policy "site_settings_select" on site_settings for select using (true);
create policy "site_settings_insert" on site_settings for insert with check (true);
create policy "site_settings_update" on site_settings for update using (true) with check (true);
create policy "site_settings_delete" on site_settings for delete using (true);

create policy "camp_sessions_select" on camp_sessions for select using (true);
create policy "camp_sessions_insert" on camp_sessions for insert with check (true);
create policy "camp_sessions_update" on camp_sessions for update using (true) with check (true);
create policy "camp_sessions_delete" on camp_sessions for delete using (true);

create policy "gallery_photos_select" on gallery_photos for select using (true);
create policy "gallery_photos_insert" on gallery_photos for insert with check (true);
create policy "gallery_photos_update" on gallery_photos for update using (true) with check (true);
create policy "gallery_photos_delete" on gallery_photos for delete using (true);

create policy "reviews_select_approved" on reviews for select using (approved = true);
create policy "reviews_insert" on reviews for insert with check (true);
create policy "reviews_admin_select" on reviews for select using (true);
create policy "reviews_admin_update" on reviews for update using (true) with check (true);
create policy "reviews_admin_delete" on reviews for delete using (true);

insert into site_settings (key, value) values
  ('content_json', '{}'),
  ('price_3day', '190€'),
  ('price_4day', '235€'),
  ('price_5day', '265€'),
  ('group_size', '12-16'),
  ('age_range', '7-12'),
  ('day_hours', '09:00-16:30'),
  ('next_session_date', '15.06.2026'),
  ('hero_video', '/hero-video.mp4'),
  ('phone', '+372 55512872'),
  ('email', 'info@timetosurf.ee'),
  ('cta_link', 'https://docs.google.com/forms/d/e/1FAIpQLSf-HIXlcSpWy0v0MfJ7HpFNcn_fGDd2Hns2JeHe4kZkNVtqDA/viewform'),
  ('telegram_link', 'https://t.me/Andrei_Time_to_Surf'),
  ('instagram_link', 'https://www.instagram.com/timetosurf.ee'),
  ('facebook_link', 'https://www.facebook.com/timetosurf.ee'),
  ('site_link', 'https://timetosurf.ee'),
  ('seo_title', 'Детский серфинг-лагерь Time to Surf в Таллине | Лето 2026'),
  ('seo_description', 'Time to Surf: детский серфинг-лагерь у моря в Таллине. Водные виды спорта, безопасность, инструкторы, питание и активное лето для детей 7-12 лет.');

insert into camp_sessions (dates, type_ru, type_en, type_et, color, leaders, hot, detail, sort_order, spots_left, capacity) values
  ('15.06 - 19.06.2026', 'Серфинг + кино', 'Surf + cinema', 'Surf + kino', '#ff7b5c', 'Наташа К. + Даша', true, 'kino', 1, 4, 16),
  ('29.06 - 03.07.2026', 'Серфинг + кино', 'Surf + cinema', 'Surf + kino', '#ff7b5c', 'Наташа К. + Даша', false, 'kino', 2, 8, 16),
  ('06.07 - 10.07.2026', 'Серфинг лагерь', 'Surf camp', 'Surfilaager', '#0e7490', 'Надежда + Григорий', false, 'surf', 3, 6, 16),
  ('13.07 - 17.07.2026', 'Серфинг + поход', 'Surf + hike', 'Surf + matk', '#16856f', 'Виталий + Григорий + Артём', false, 'hike', 4, 7, 16),
  ('20.07 - 24.07.2026', 'Серфинг лагерь', 'Surf camp', 'Surfilaager', '#0e7490', 'Надежда + Ксения', false, 'surf', 5, 9, 16),
  ('27.07 - 30.07.2026', 'Серфинг 4 дня', 'Surf 4 days', 'Surf 4 päeva', '#0e7490', 'Ольга Боброва + Артём', false, 'surf', 6, 5, 16),
  ('03.08 - 07.08.2026', 'Серфинг лагерь', 'Surf camp', 'Surfilaager', '#0e7490', 'Даша + Артём', false, 'surf', 7, 10, 16),
  ('10.08 - 14.08.2026', 'Серфинг лагерь', 'Surf camp', 'Surfilaager', '#0e7490', 'Надежда + команда', false, 'surf', 8, 10, 16),
  ('17.08 - 21.08.2026', 'Серфинг + поход', 'Surf + hike', 'Surf + matk', '#16856f', 'Виталий + Артём', false, 'hike', 9, 8, 16);

insert into gallery_photos (url, section, sort_order) values
  ('/DSC03180.jpg', 'hero', 1),
  ('/DSC03177.jpg', 'moments', 2),
  ('/DSC03142.jpg', 'moments', 3),
  ('/DSC03136.jpg', 'moments', 4),
  ('/DSC03057.jpg', 'water', 5),
  ('/DSC03039.jpg', 'water', 6),
  ('/DSC03014.jpg', 'water', 7),
  ('/DSC02979.jpg', 'moments', 8),
  ('/DSC02967.jpg', 'moments', 9),
  ('/DSC02952.jpg', 'team', 10),
  ('/DSC02945.jpg', 'team', 11),
  ('/DSC02922.jpg', 'water', 12),
  ('/DSC02878.jpg', 'water', 13),
  ('/DSC02873.jpg', 'water', 14),
  ('/DSC02866.jpg', 'water', 15),
  ('/DSC02861.jpg', 'water', 16),
  ('/DSC02860.jpg', 'water', 17),
  ('/DSC02835.jpg', 'moments', 18),
  ('/DSC02827.jpg', 'moments', 19),
  ('/DSC02825.jpg', 'moments', 20),
  ('/DSC02550.jpg', 'moments', 21),
  ('/DSC02502.jpg', 'team', 22),
  ('/DSC02445.jpg', 'team', 23),
  ('/DSC02384.jpg', 'moments', 24),
  ('/DSC02376.jpg', 'moments', 25),
  ('/DSC02333.jpg', 'moments', 26),
  ('/DSC02326.jpg', 'moments', 27),
  ('/DSC02314.jpg', 'moments', 28),
  ('/DSC02287.jpg', 'moments', 29),
  ('/DSC02286.jpg', 'moments', 30),
  ('/DSC02107.jpg', 'moments', 31),
  ('/DSC02068.jpg', 'moments', 32),
  ('/IMG_8191.JPG', 'moments', 33),
  ('/IMG_6865.JPG', 'moments', 34),
  ('/IMG_6845.JPG', 'moments', 35),
  ('/IMG_6814.JPG', 'moments', 36),
  ('/IMG_6804.JPG', 'moments', 37),
  ('/IMG_6794.JPG', 'moments', 38),
  ('/IMG_6791.JPG', 'moments', 39),
  ('/IMG_6773.JPG', 'moments', 40),
  ('/IMG_6768.JPG', 'moments', 41),
  ('/IMG_6751.JPG', 'moments', 42),
  ('/IMG_6750.JPG', 'moments', 43),
  ('/IMG_6746.JPG', 'moments', 44),
  ('/IMG_6745.JPG', 'moments', 45),
  ('/IMG_6737.JPG', 'moments', 46),
  ('/IMG_6716.JPG', 'moments', 47),
  ('/IMG_6704.JPG', 'moments', 48),
  ('/IMG_6516.JPG', 'moments', 49),
  ('/IMG_6492.JPG', 'moments', 50),
  ('/IMG_6490.JPG', 'moments', 51),
  ('/IMG_6438.JPG', 'moments', 52),
  ('/IMG_6388.JPG', 'moments', 53),
  ('/IMG_6382.JPG', 'moments', 54),
  ('/IMG_6371.JPG', 'moments', 55),
  ('/IMG_6362.JPG', 'moments', 56);

insert into reviews (name, text, program, rating, approved) values
  ('Мария, мама Артёма', 'Сын впервые так ждал утро. После смены стал смелее на воде и почти не вспоминал про телефон.', 'Серфинг лагерь', 5, true),
  ('Анна', 'Понравилось, что всё спокойно и по делу: жилеты, инструкторы рядом, ребёнок уставший и счастливый.', 'Серфинг + кино', 5, true),
  ('Елена', 'Очень тёплая команда. Видно, что детям дают свободу, но не отпускают из внимания.', 'Серфинг + поход', 5, true);
