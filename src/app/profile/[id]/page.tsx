"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Trophy, TrendingUp, Swords, ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const id = params.id as string;

    const [profile, setProfile] = useState<any>(null);
    const [positions, setPositions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [challenging, setChallenging] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return;

            // 1. Fetch Profile
            const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching profile", error);
                setLoading(false);
                return;
            }

            setProfile(profileData);

            // 2. Fetch Public Positions (Simplified, maybe just top holdings?)
            const { data: posData } = await supabase
                .from('portfolio_positions')
                .select('*')
                .eq('user_id', id)
                .order('shares', { ascending: false }); // Just a heuristic for "top"

            setPositions(posData || []);
            setLoading(false);
        };

        fetchProfile();
    }, [id]);

    const handleChallenge = async () => {
        if (!user) return alert("Debes iniciar sesión para retar.");
        setChallenging(true);

        try {
            const { error } = await supabase
                .from('challenges')
                .insert({
                    challenger_id: user.id,
                    challenged_id: id,
                    status: 'pending'
                });

            if (error) throw error;
            alert("¡Reto enviado! Espera a que acepten.");
        } catch (e: any) {
            alert("Error al enviar reto: " + e.message);
        } finally {
            setChallenging(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex justify-center text-muted-foreground-app font-mono">
                <Loader2 className="animate-spin" /> Cargando perfil...
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-8 flex flex-col items-center gap-4 text-muted-foreground-app font-mono">
                <ShieldAlert size={48} />
                <p>Perfil no encontrado o es privado.</p>
                <Link href="/leaderboard" className="text-primary-app underline">Volver al Leaderboard</Link>
            </div>
        );
    }

    const isOwnProfile = user?.id === id;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-8">
            <button onClick={() => router.back()} className="text-muted-foreground-app hover:text-foreground-app flex items-center gap-2 font-mono text-xs">
                <ArrowLeft size={16} /> VOLVER
            </button>

            {/* Profile Header */}
            <div className="terminal-card p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-secondary-app to-background-app">
                <div className="relative">
                    <img
                        src={profile.avatar_url || `https://api.dicebear.com/9.x/pixel-art/svg?seed=${profile.username}`}
                        alt={profile.username}
                        className="w-32 h-32 rounded-full border-4 border-primary-app shadow-[0_0_20px_#3b82f640]"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-background-app p-2 rounded-full border border-border-app">
                        <Trophy className="text-yellow-500" size={20} />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left flex flex-col gap-2">
                    <h1 className="text-4xl font-bold font-mono text-foreground-app tracking-tight">
                        {profile.username || 'Anonymous Investor'}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-mono text-muted-foreground-app">
                        <span className="flex items-center gap-1">
                            <User size={14} /> Level {Math.floor((profile.ranking_points || 0) / 1000) + 1}
                        </span>
                        <span className="flex items-center gap-1">
                            <TrendingUp size={14} className="text-emerald-400" />
                            Score: {profile.ranking_points?.toLocaleString() || 0}
                        </span>
                    </div>

                    {!isOwnProfile && (
                        <div className="mt-4">
                            <button
                                onClick={handleChallenge}
                                disabled={challenging}
                                className="terminal-btn terminal-btn-primary w-full md:w-auto justify-center shadow-[0_0_15px_#ef444440] hover:bg-rose-600 border-rose-500"
                            >
                                <Swords size={18} />
                                {challenging ? 'ENVIANDO...' : 'RETAR 1 vs 1'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 min-w-[200px] text-right">
                    <div className="terminal-card p-4 bg-background-app/50 border-primary-app/20">
                        <p className="text-[10px] text-muted-foreground-app font-mono uppercase">Total Equity</p>
                        <p className="text-2xl font-bold font-mono text-foreground-app">
                            ${profile.total_equity?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <div className="terminal-card p-4 bg-background-app/50 border-emerald-500/20">
                        <p className="text-[10px] text-muted-foreground-app font-mono uppercase">Cash Balance</p>
                        <p className="text-lg font-bold font-mono text-emerald-400">
                            ${profile.balance?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Portfolio Composition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="terminal-card p-6">
                    <h3 className="text-sm font-mono font-bold text-muted-foreground-app mb-4 uppercase flex items-center gap-2">
                        <User size={16} className="text-blue-500" /> Portfolio Holdings
                    </h3>

                    {positions.length === 0 ? (
                        <p className="text-xs font-mono text-muted-foreground-app text-center py-8">
                            Portafolio oculto o vacío.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {positions.map((pos) => (
                                <div key={pos.symbol} className="flex justify-between items-center p-2 hover:bg-secondary-app rounded border border-transparent hover:border-border-app transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-background-app border border-border-app flex items-center justify-center font-bold font-mono text-xs">
                                            {pos.symbol.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-bold font-mono text-sm">{pos.symbol}</p>
                                            <p className="text-[10px] text-muted-foreground-app">{pos.shares} shares</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-sm">${(pos.average_price * pos.shares).toLocaleString()}</p>
                                        <p className="text-[10px] text-emerald-400">Avg: ${pos.average_price.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="terminal-card p-6 flex items-center justify-center text-center text-muted-foreground-app border-dashed">
                    <div className="flex flex-col gap-2 items-center">
                        <Swords size={32} className="opacity-20" />
                        <h3 className="font-bold font-mono">Vs History</h3>
                        <p className="text-xs font-mono max-w-[200px]">
                            El historial de batallas contra este usuario aparecerá aquí próximamente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
