"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Award, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const BadgeAwarder = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const runCheck = async () => {
        if (!confirm('¿Escanear y otorgar badges a todos los usuarios?')) return;
        setLoading(true);
        setResult(null);

        try {
            // Fetch all users
            const { data: users } = await supabase.from('profiles').select('id, username');

            if (!users) throw new Error("No users found");

            let awardedCount = 0;

            for (const user of users) {
                const { data, error } = await supabase.rpc('check_and_award_badges', { target_user_id: user.id });
                if (data && data.length > 0) {
                    console.log(`Awarded to ${user.username}:`, data);
                    awardedCount += data.length;
                }
            }

            setResult(`Escaneo completo. Se han entregado ${awardedCount} nuevas medallas.`);
        } catch (e: any) {
            setResult(`Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="terminal-card p-4 border-yellow-500/30 bg-yellow-500/5">
            <h3 className="text-sm font-mono font-bold text-yellow-500 mb-2 flex items-center gap-2">
                <Award size={16} /> ADMINISTRAR BADGES
            </h3>
            <p className="text-xs text-muted-foreground-app font-mono mb-4">
                Ejecuta el script de "Gamification Engine" para comprobar si los usuarios cumplen los requisitos de los logros.
            </p>

            <button
                onClick={runCheck}
                disabled={loading}
                className="terminal-btn terminal-btn-primary w-full justify-center"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Award size={16} />}
                {loading ? 'CHECKING...' : 'RUN BADGE CHECK'}
            </button>

            {result && (
                <p className="mt-2 text-xs font-mono text-emerald-400">
                    {result}
                </p>
            )}
        </div>
    );
};
