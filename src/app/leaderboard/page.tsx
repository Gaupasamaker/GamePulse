"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trophy, TrendingUp, User, Shield } from 'lucide-react';
import { supabase, Profile } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

import { ActivityFeed } from '@/components/ActivityFeed';

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('total_equity', { ascending: false })
                .limit(20);

            if (error) {
                console.error('Error fetching leaderboard:', error);
            } else {
                setProfiles(data || []);
            }
            setLoading(false);
        };

        fetchLeaderboard();

        // Refresh cada 30s
        const interval = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-mono text-white tracking-tighter flex items-center gap-3">
                    <Trophy className="text-yellow-500" size={32} />
                    GAMEPULSE ARENA
                </h1>
                <p className="text-gray-500 font-mono">
                    Compite con inversores de todo el mundo.
                </p>
            </div>

            {!user && (
                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex items-center gap-4">
                    <Shield className="text-blue-400" />
                    <div>
                        <h3 className="text-white font-bold text-sm">Modo Espectador</h3>
                        <p className="text-gray-400 text-xs">Inicia sesión para competir y aparecer en el ranking.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Leaderboard */}
                <div className="lg:col-span-2 terminal-card overflow-hidden">
                    <div className="p-4 border-b border-border-app bg-black/20">
                        <h3 className="text-sm font-mono font-bold text-white">TOP INVESTORS</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-sm">
                            <thead className="bg-[#1a1a1a] text-gray-500 border-b border-gray-800">
                                <tr>
                                    <th className="p-4 w-16 text-center">RANK</th>
                                    <th className="p-4">JUGADOR</th>
                                    <th className="p-4 text-right">VALOR CARTERA</th>
                                    <th className="p-4 text-right">PUNTOS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="border-b border-gray-800/50">
                                            <td className="p-4"><div className="h-4 w-8 bg-gray-800 rounded animate-pulse" /></td>
                                            <td className="p-4"><div className="h-4 w-32 bg-gray-800 rounded animate-pulse" /></td>
                                            <td className="p-4"><div className="h-4 w-24 bg-gray-800 rounded animate-pulse ml-auto" /></td>
                                            <td className="p-4"><div className="h-4 w-16 bg-gray-800 rounded animate-pulse ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : profiles.length > 0 ? (
                                    profiles.map((profile, index) => (
                                        <tr
                                            key={profile.id}
                                            className={`border-b border-gray-800/50 hover:bg-white/5 transition-colors ${user?.id === profile.id ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : ''}`}
                                        >
                                            <td className="p-4 text-center font-bold text-gray-400">
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                            </td>
                                            <td className="p-4 flex items-center gap-3">
                                                {profile.avatar_url ? (
                                                    <img src={profile.avatar_url} className="w-8 h-8 rounded-full border border-gray-700 object-cover" alt="avatar" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white border border-gray-600">
                                                        {profile.username?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className={user?.id === profile.id ? 'text-blue-400 font-bold' : 'text-gray-300'}>
                                                        {profile.username || 'Anonymous'}
                                                    </span>
                                                    {user?.id === profile.id && <span className="text-[10px] text-blue-500 uppercase">YOU</span>}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right text-emerald-400 font-bold">
                                                ${profile.total_equity?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 text-right text-yellow-500 font-mono">
                                                {profile.ranking_points || 0}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
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

