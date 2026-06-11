-- Таблица отзывов для Time to Surf
create table if not exists reviews (
  id bigserial primary key,
  name text not null,
  text text not null,
  program text,
  rating int not null default 5 check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz default now()
);

-- RLS
alter table reviews enable row level security;

create policy "Public can read approved reviews"
  on reviews for select
  using (approved = true);

create policy "Anyone can insert review"
  on reviews for insert
  with check (true);
