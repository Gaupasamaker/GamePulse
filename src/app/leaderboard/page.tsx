"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Medal, User, Calendar, History, Sword, Shield } from 'lucide-react';
import { supabase, Profile } from '@/lib/supabase'; // Consolidated
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import { ActivityFeed } from '@/components/ActivityFeed';
import { useLanguage } from '@/providers/LanguageProvider'; // Added
import { HelpTooltip } from '@/components/HelpTooltip';

export default function LeaderboardPage() {
    const { user } = useAuth();
    const { t } = useLanguage(); // Added hook usage
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<'all' | 'weekly' | 'monthly'>('all');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .limit(50); // Traemos más para ordenar en cliente por ahora

            if (error) {
                console.error('Error fetching leaderboard:', error);
            } else {
                let sortedData = data || [];

                // Calcular ROI y Ordenar según Timeframe
                sortedData = sortedData.map(p => {
                    const current = p.total_equity + (p.balance || 0); // Total Equity + Cash
                    // Fallback to current if start is missing (0% ROI)
                    const weeklyStart = p.weekly_start_equity || 10000;
                    const monthlyStart = p.monthly_start_equity || 10000;

                    let roi = 0;
                    if (timeframe === 'weekly') {
                        roi = ((current - weeklyStart) / weeklyStart) * 100;
                    } else if (timeframe === 'monthly') {
                        roi = ((current - monthlyStart) / monthlyStart) * 100;
                    } else {
                        // All Time (vs 10k default)
                        roi = ((current - 10000) / 10000) * 100;
                    }

                    return { ...p, calculated_roi: roi, total_value: current };
                });

                sortedData.sort((a: any, b: any) => b.calculated_roi - a.calculated_roi);
                setProfiles(sortedData.slice(0, 20));
            }
            setLoading(false);
        };

        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(interval);
    }, [timeframe]);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-mono text-foreground-app tracking-tighter flex items-center gap-3">
                    <Trophy className="text-yellow-500" size={32} />
                    GAMEPULSE ARENA
                </h1>
                <p className="text-muted-foreground-app font-mono">
                    Compite con inversores de todo el mundo.
                </p>
            </div>

            {!user && (
                <div className="bg-primary-app/10 border border-primary-app/30 p-4 rounded-lg flex items-center gap-4">
                    <Shield className="text-primary-app" />
                    <div>
                        <h3 className="text-foreground-app font-bold text-sm">Modo Espectador</h3>
                        <p className="text-muted-foreground-app text-xs">Inicia sesión para competir y aparecer en el ranking.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Leaderboard */}
                <div className="lg:col-span-2 terminal-card overflow-hidden">
                    <div className="p-4 border-b border-border-app bg-secondary-app flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="text-sm font-mono font-bold text-foreground-app">TOP INVESTORS</h3>

                        <div className="flex bg-muted-app rounded p-1 border border-border-app">
                            {(['all', 'monthly', 'weekly'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTimeframe(t)}
                                    className={`px-4 py-1 rounded text-xs font-mono transition-colors uppercase ${timeframe === t
                                        ? 'bg-primary-app text-primary-foreground-app font-bold shadow-lg shadow-blue-500/20'
                                        : 'text-muted-foreground-app hover:text-foreground-app hover:bg-secondary-app'
                                        }`}
                                >
                                    {t === 'all' ? 'All Time' : t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-sm">
                            <thead className="bg-muted-app text-muted-foreground-app border-b border-border-app">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground-app">{t('rank')}</th>
                                    <th className="px-4 py-3 font-semibold text-muted-foreground-app">{t('player')}</th>
                                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground-app flex items-center justify-end">
                                        Total Return
                                        <HelpTooltip text="Rentabilidad total desde el inicio (equity actual / $10k)." />
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground-app">
                                        <span className="flex items-center justify-end">
                                            Points
                                            <HelpTooltip text="Puntos de Ranking = Rentabilidad Total * 100." />
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="border-b border-border-app">
                                            <td className="p-4"><div className="h-4 w-8 bg-muted-app rounded animate-pulse" /></td>
                                            <td className="p-4"><div className="h-4 w-32 bg-muted-app rounded animate-pulse" /></td>
                                            <td className="p-4"><div className="h-4 w-24 bg-muted-app rounded animate-pulse ml-auto" /></td>
                                            <td className="p-4"><div className="h-4 w-16 bg-muted-app rounded animate-pulse ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : profiles.length > 0 ? (
                                    profiles.map((profile: any, index) => (
                                        <tr
                                            key={profile.id}
                                            className={`border-b border-border-app hover:bg-secondary-app transition-colors ${user?.id === profile.id ? 'bg-primary-app/10 border-l-2 border-l-primary-app' : ''}`}
                                        >
                                            <td className="p-4 text-center font-bold text-muted-foreground-app">
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                            </td>
                                            <td className="p-4 flex items-center gap-3">
                                                {profile.avatar_url ? (
                                                    <img src={profile.avatar_url} className="w-8 h-8 rounded-full border border-border-app object-cover" alt="avatar" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-secondary-app flex items-center justify-center text-xs text-foreground-app border border-border-app">
                                                        {profile.username?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <Link href={`/profile/${profile.id}`} className={user?.id === profile.id ? 'text-primary-app font-bold hover:underline' : 'text-muted-foreground-app hover:text-foreground-app hover:underline'}>
                                                        {profile.username || 'Anonymous'}
                                                    </Link>
                                                    {user?.id === profile.id && <span className="text-[10px] text-blue-500 uppercase">YOU</span>}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right text-muted-foreground-app font-mono">
                                                ${profile.total_value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className={`p-4 text-right font-bold font-mono ${(profile.calculated_roi || 0) >= 0 ? 'text-emerald-400' : 'text-rose-500'
                                                }`}>
                                                {(profile.calculated_roi || 0) > 0 ? '+' : ''}
                                                {(profile.calculated_roi || 0).toFixed(2)}%
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground-app">
                                            Aún no hay jugadores clasificados. ¡Sé el primero!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Columna Derecha: Activity Feed */}
                <div className="lg:col-span-1 h-[600px] lg:h-auto">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}

