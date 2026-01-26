-- Habilitar la extensión para generar UUIDs si no existe
create extension if not exists "uuid-ossp";

-- 1. Tabla de Perfiles (Profiles)
-- Se vincula automáticamente con la tabla de usuarios de Supabase (auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  total_equity numeric default 0,
  ranking_points int default 0,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Habilitar Row Level Security (Seguridad por filas)
alter table public.profiles enable row level security;

-- Políticas de Seguridad para Perfiles
-- "Cualquiera puede ver perfiles (para el Leaderboard)"
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

-- "El usuario solo puede editar su propio perfil"
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- 2. Tabla de Transacciones (Portfolio)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  ticker text not null,
  amount numeric not null,
  price numeric not null,
  type text check (type in ('buy', 'sell')),
  created_at timestamp with time zone default now()
);

alter table public.transactions enable row level security;

-- Políticas de Seguridad para Transacciones
-- "Solo el dueño puede ver y crear sus transacciones"
create policy "Users can see own transactions"
  on public.transactions for select
  using ( auth.uid() = user_id );

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check ( auth.uid() = user_id );

-- 3. Trigger para crear perfil automáticamente al registrarse
-- Esto es magia de Supabase: cada vez que alguien se registra, le crea una entrada en profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- COPIA Y PEGA ESTO EN EL SQL EDITOR DE SUPABASE DASHBOARD
