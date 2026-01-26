-- TABLA DE ACTIVIDAD (Social Feed)
create table if not exists public.activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  type text not null, -- 'buy', 'sell', 'achievement'
  description text not null,
  metadata jsonb, -- guardamos datos extra ej. { ticker: 'AAPL', amount: 10 }
  created_at timestamp with time zone default now()
);

-- Habilitar seguridad
alter table public.activities enable row level security;

-- Todos pueden ver las actividades
create policy "Activities are viewable by everyone"
  on public.activities for select
  using ( true );

-- Solo el sistema (via triggers) o el usuario pueden insertar
create policy "Users can insert own activities"
  on public.activities for insert
  with check ( auth.uid() = user_id );

-- FUNCION TRIGGER: Crear actividad al realizar transacción
create or replace function public.handle_new_transaction()
returns trigger as $$
declare
  user_name text;
begin
  -- Intentamos obtener el nombre del usuario, si no usa 'Someone'
  select username into user_name from public.profiles where id = new.user_id;
  if user_name is null then
    user_name := 'Someone';
  end if;

  insert into public.activities (user_id, type, description, metadata)
  values (
    new.user_id, 
    new.type, 
    -- Descripción legible: "Jon bought 10 AAPL"
    user_name || ' ' || new.type || 's ' || new.amount || ' shares of ' || new.ticker,
    jsonb_build_object('ticker', new.ticker, 'amount', new.amount, 'price', new.price)
  );
  return new;
end;
$$ language plpgsql security definer;

-- ACTIVAR TRIGGER
drop trigger if exists on_transaction_created on public.transactions;
create trigger on_transaction_created
  after insert on public.transactions
  for each row execute procedure public.handle_new_transaction();
