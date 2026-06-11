# Time to Surf — детские лагеря 2026

## Что внутри

- Next.js лендинг для Time to Surf Stroomi camps.
- Hero с видео `/public/hero-video.mp4`.
- Три программы с кнопками `Подробнее` и модалками: серфинг, серфинг + кино, серфинг + поход.
- Галерея с lightbox и нижней лентой фото.
- Админка `/admin` для текстов, цифр, смен, фото, отзывов и SEO.
- Supabase setup в одном файле: `supabase_setup.sql`.

## Запуск

```bash
npm install
npm run dev
```

## Supabase

1. Создай проект в Supabase.
2. Выполни `supabase_setup.sql` в SQL Editor.
3. Добавь переменные в `.env.local` и Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
```
