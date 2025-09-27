-- Run this in your Supabase SQL editor to add the session table
-- This is the session table part from the updated schema.sql

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

