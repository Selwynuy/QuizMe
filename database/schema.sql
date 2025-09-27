-- QuizMe core schema (Postgres / Supabase)
-- Safe to run multiple times; uses IF NOT EXISTS where possible.

-- Enable UUIDs and timestamps helpers
create extension if not exists "uuid-ossp";

-- Profiles (optional convenience table for user metadata)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  email_notifications boolean not null default true,
  push_notifications boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- Decks
create table if not exists public.decks (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists decks_set_updated_at on public.decks;
create trigger decks_set_updated_at
before update on public.decks
for each row execute procedure public.set_updated_at();

-- Cards
create table if not exists public.cards (
  id uuid primary key default uuid_generate_v4(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  front text not null,
  back text not null,
  hint text,
  image_url text,
  audio_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists cards_set_updated_at on public.cards;
create trigger cards_set_updated_at
before update on public.cards
for each row execute procedure public.set_updated_at();

-- Study sessions (a session per study run)
create table if not exists public.study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deck_id uuid not null references public.decks(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

-- Reviews (per-card review log with SRS fields)
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deck_id uuid not null references public.decks(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  session_id uuid references public.study_sessions(id) on delete set null,
  grade smallint not null check (grade between 0 and 3), -- 0=again,1=hard,2=good,3=easy
  ease_factor numeric(6,3) not null default 2.500, -- SM-2 style starting EF
  interval_days integer not null default 0,
  due_at timestamptz,
  reviewed_at timestamptz not null default now()
);

-- Recommended indexes
create index if not exists idx_decks_owner on public.decks(owner_id);
create index if not exists idx_cards_deck on public.cards(deck_id);
create index if not exists idx_reviews_user_due on public.reviews(user_id, due_at);
create index if not exists idx_reviews_card on public.reviews(card_id);

-- RLS
alter table public.profiles enable row level security;
alter table public.decks enable row level security;
alter table public.cards enable row level security;
alter table public.study_sessions enable row level security;
alter table public.reviews enable row level security;

-- Profiles: user can read/update own row
drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update using (auth.uid() = id);

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
  for insert with check (auth.uid() = id);

-- Safe alters for added columns if table already exists
alter table public.profiles add column if not exists email_notifications boolean not null default true;
alter table public.profiles add column if not exists push_notifications boolean not null default false;

-- Decks: owner full access, public readable when is_public
drop policy if exists decks_owner_rw on public.decks;
create policy decks_owner_rw on public.decks
  for all using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists decks_public_read on public.decks;
create policy decks_public_read on public.decks
  for select using (is_public or auth.uid() = owner_id);

-- Cards: inherit from deck ownership or public read when deck is public
drop policy if exists cards_owner_rw on public.cards;
create policy cards_owner_rw on public.cards
  for all using (exists (
    select 1 from public.decks d where d.id = deck_id and d.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.decks d where d.id = deck_id and d.owner_id = auth.uid()
  ));

drop policy if exists cards_public_read on public.cards;
create policy cards_public_read on public.cards
  for select using (exists (
    select 1 from public.decks d where d.id = deck_id and (d.is_public or d.owner_id = auth.uid())
  ));

-- Study sessions: user-owned only
drop policy if exists study_sessions_user_rw on public.study_sessions;
create policy study_sessions_user_rw on public.study_sessions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Reviews: user-owned only
drop policy if exists reviews_user_rw on public.reviews;
create policy reviews_user_rw on public.reviews
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- User sessions (for server-side session storage)
create table if not exists public.user_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_token text not null unique,
  oauth_data jsonb, -- Store the large OAuth token data here
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists user_sessions_set_updated_at on public.user_sessions;
create trigger user_sessions_set_updated_at
before update on public.user_sessions
for each row execute procedure public.set_updated_at();

-- Index for session lookups
create index if not exists idx_user_sessions_token on public.user_sessions(session_token);
create index if not exists idx_user_sessions_user on public.user_sessions(user_id);
create index if not exists idx_user_sessions_expires on public.user_sessions(expires_at);

-- RLS for sessions
alter table public.user_sessions enable row level security;

-- Sessions: user can only access their own sessions
drop policy if exists user_sessions_user_rw on public.user_sessions;
create policy user_sessions_user_rw on public.user_sessions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


