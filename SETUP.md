# Time to Surf — Детские лагеря 2026

## Что сделано

- Новый дизайн: морская палитра (бирюза, глубокий синий, песочный), шрифты Manrope + Plus Jakarta Sans
- Настоящее лого (`/public/logo.jpeg`)
- Кнопка «Подробнее» на каждой карточке формата — раскрывает детали ведущего
- Отзывы через Supabase (GET/POST `/api/reviews`)
- Все реальные фотографии в галерее
- Мобильное меню, анимации при скролле, FAQ-аккордеон
- 3 языка: RU / EN / ET

## Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Запустите `supabase_schema.sql` в SQL-редакторе
3. Добавьте в `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
```

## Запуск

```bash
npm install
npm run dev
```
