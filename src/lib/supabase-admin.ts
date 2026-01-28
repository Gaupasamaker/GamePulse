import { createClient } from '@supabase/supabase-js';

// NOTA: Esta key nunca debe exponerse en el cliente (navegador)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key-for-build';

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn('Faltan variables de entorno para Supabase Admin (URL o Service Role Key).');
} else {
    // Confirmación en logs del servidor (no expone claves)
    console.log('Supabase Admin: Inicializado correctamente con Service Role.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
