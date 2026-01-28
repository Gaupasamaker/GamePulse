
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Fix for Next.js 15+ params
) {
    try {
        const id = (await params).id;
        console.log(`[ADMIN] Eliminando usuario manual: ${id}`);

        if (!id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // 1. Cascade Manual: Eliminar transacciones
        const { error: txError } = await supabaseAdmin
            .from('transactions')
            .delete()
            .eq('user_id', id);

        if (txError) throw txError;

        // 2. Eliminar Perfil
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', id);

        if (profileError) throw profileError;

        // 3. (Opcional) Eliminar de Auth.users si pudiéramos (requiere listUsers ok)
        // Por ahora nos conformamos con limpiar la data pública.
        // Si la Service Key está bien configurada, esto debería funcionar:
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

        if (authError) {
            console.warn('[ADMIN] No se pudo borrar de Auth (posiblemente ya borrado o key sin permisos), pero data limpiada.', authError);
            // No fallamos la request si solo falla auth delete, lo importante es limpiar la app
        }

        return NextResponse.json({ success: true, message: 'Usuario eliminado correctamente' });

    } catch (err: any) {
        console.error('[ADMIN] Error borrando usuario:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
