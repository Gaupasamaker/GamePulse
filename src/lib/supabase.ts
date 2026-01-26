import { createBrowserClient } from '@supabase/ssr';

// Estas variables deben definirse en .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Cliente singleton para usar en toda la app
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);

// Tipos para nuesta base de datos (se pueden generar automáticos con Supabase CLI, 
// pero los definimos a mano para el MVP por simplicidad)
export type Profile = {
    id: string;
    username: string | null;
    avatar_url: string | null;
    total_equity: number;
    ranking_points: number;
    updated_at: string;
};

export type Transaction = {
    id: string;
    user_id: string;
    ticker: string;
    amount: number;
    price: number;
    type: 'buy' | 'sell';
    created_at: string;
};
