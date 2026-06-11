# Time to Surf — настройка Supabase и админки

## 1. Supabase

1. Открой Supabase Dashboard и выбери проект.
2. Перейди в SQL Editor.
3. Вставь и выполни весь файл `supabase_setup.sql`.

Файл удаляет старые таблицы и заново создаёт:

- `site_settings` — тексты сайта, цены, возраст, ссылки, SEO, hero-видео.
- `camp_sessions` — даты смен, места, руководители, тип программы.
- `gallery_photos` — фотографии галереи и hero.
- `reviews` — отзывы и модерация.

## 2. ENV для Vercel

Добавь в Vercel и локально в `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
```

## 3. Админка

Адрес: `/admin`

Пароль по умолчанию: `surf2026admin`

В админке можно менять:

- все тексты RU / EN / ET;
- цены, возраст, время, ссылки и hero-видео один раз для всех языков;
- даты смен, количество мест, руководителей и тип программы;
- фотографии;
- отзывы;
- SEO title и description.

Пароль хранится в `app/admin/page.tsx` в константе `ADMIN_PASSWORD`.
