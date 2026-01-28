import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Datos aleatorios para generar usuarios
const USERNAME_PREFIXES = ['Pixel', 'Cyber', 'Retro', 'Neon', 'Meta', 'Crypto', 'Game', 'Tech', 'Code', 'Byte'];
const USERNAME_SUFFIXES = ['Hunter', 'Master', 'Ninja', 'Guru', 'Wizard', 'Lord', 'King', 'Queen', 'Shadow', 'Light'];
const NUMBERS = ['77', '99', '101', '404', '3000', 'X', 'Z'];

const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomUser = () => {
    const username = `${getRandomElement(USERNAME_PREFIXES)}${getRandomElement(USERNAME_SUFFIXES)}${getRandomElement(NUMBERS)}`;
    // Usamos DiceBear para avatares aleatorios consistentes
    const avatarSeed = Math.random().toString(36).substring(7);
    const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${avatarSeed}`;

    // Generar un UUID aleatorio (v4-like)
    const id = crypto.randomUUID();

    // Random Stats
    const totalEquity = 10000 + (Math.random() * 50000); // 10k - 60k
    const balance = Math.random() * 5000;

    // Calcular ROI para que sea interesante (algunos ganan, otros pierden)
    // El "Start Equity" debería ser tal que (Current - Start) / Start varié
    const roiPercent = (Math.random() * 40) - 10; // -10% a +30%
    const startEquity = totalEquity / (1 + (roiPercent / 100));

    return {
        id,
        username,
        avatar_url: avatarUrl,
        total_equity: totalEquity,
        balance: balance,
        ranking_points: Math.floor(totalEquity * 0.1),
        weekly_start_equity: startEquity,
        monthly_start_equity: startEquity * 0.95, // Un poco menos para simular crecimiento mensual
        updated_at: new Date().toISOString()
    };
};

export async function POST() {
    try {
        console.log('Iniciando población de usuarios...');
        const dummyUsers = Array.from({ length: 10 }).map(() => generateRandomUser());

        // Insertar en la tabla profiles
        // NOTA: Como no estamos creando usuarios en auth.users, estos "usuarios fantasma" 
        // no podrán iniciar sesión, pero aparecerán en el Leaderboard.
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .insert(dummyUsers)
            .select();

        if (error) {
            console.error('Error insertando usuarios:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            message: `Se han generado ${dummyUsers.length} usuarios de prueba correctamente.`,
            count: dummyUsers.length,
            users: data
        });

    } catch (err: any) {
        console.error('Error fatal al poblar usuarios:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }

}

export async function DELETE() {
    try {
        console.log('Iniciando limpieza de usuarios fantasma (Cascade Manual)...');

        const BOT_AVATAR_PATTERN = '%dicebear.com%';

        // 1. Obtener IDs de los bots
        const { data: bots, error: fetchError } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .like('avatar_url', BOT_AVATAR_PATTERN);

        if (fetchError) throw fetchError;

        console.log(`[DELETE] Bots detectados: ${bots.length}`);

        if (bots.length === 0) {
            return NextResponse.json({
                message: 'No se encontraron bots para eliminar.',
                count: 0
            });
        }

        const botIds = bots.map(b => b.id);

        // 2. Eliminar Transacciones asociadas (Manual Cascade)
        const { error: deleteTransactionsError } = await supabaseAdmin
            .from('transactions')
            .delete()
            .in('user_id', botIds);

        if (deleteTransactionsError) {
            console.error('[DELETE] Error borrando transacciones:', deleteTransactionsError);
            throw deleteTransactionsError;
        }

        // 3. Eliminar Perfiles
        const { error: deleteProfilesError, count } = await supabaseAdmin
            .from('profiles')
            .delete()
            .in('id', botIds)
            .select();

        if (deleteProfilesError) {
            console.error('[DELETE] Error borrando perfiles:', deleteProfilesError);
            throw deleteProfilesError;
        }

        return NextResponse.json({
            message: `Se han purgado ${count} bots y sus transacciones correctamente.`,
            count: count,
            strategy: 'manual_cascade'
        });

    } catch (err: any) {
        console.error('Error fatal al limpiar usuarios:', err);
        return NextResponse.json({
            error: err.message || 'Internal Server Error',
            details: 'Falló la eliminación en cascada'
        }, { status: 500 });
    }
}
