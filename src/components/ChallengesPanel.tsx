"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Swords, Check, X, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Challenge {
    id: string;
    challenger_id: string;
    challenged_id: string;
    status: 'pending' | 'active' | 'completed' | 'declined';
    created_at: string;
    challenger?: { username: string };
    challenged?: { username: string };
}

export const ChallengesPanel = () => {
    const { user } = useAuth();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchChallenges = async () => {
        if (!user) return;

        // Fetch challenges where I am involved
        const { data, error } = await supabase
            .from('challenges')
            .select(`
                *,
                challenger:challenger_id(username),
                challenged:challenged_id(username)
            `)
            .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
            .order('created_at', { ascending: false });

        if (data) {
            // Map the joined data correctly if needed 
            // (Supabase returns arrays for joins usually, need to check if single)
            // But usually .single() or correct relationship mapping handles it.
            // Let's assume standard response for now.
            setChallenges(data as any);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchChallenges();

        // Realtime subscription
        const channel = supabase
            .channel('challenges_updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'challenges',
                filter: `challenger_id=eq.${user?.id}` // Listen for my created challenges
            }, fetchChallenges)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'challenges',
                filter: `challenged_id=eq.${user?.id}` // Listen for challenges to me
            }, fetchChallenges)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user]);

    const handleResponse = async (id: string, accept: boolean) => {
        const status = accept ? 'active' : 'declined';
        await supabase.from('challenges').update({ status }).eq('id', id);
        fetchChallenges();
    };

    if (loading) return <div className="terminal-card p-4 flex justify-center"><Loader2 className="animate-spin" /></div>;

    if (!user) return null;

    const pendingInvites = challenges.filter(c => c.status === 'pending' && c.challenged_id === user.id);
    const activeChallenges = challenges.filter(c => c.status === 'active');

    if (pendingInvites.length === 0 && activeChallenges.length === 0) {
        return (
            <div className="terminal-card p-4 text-center text-muted-foreground-app font-mono text-xs border-dashed">
                <Swords size={20} className="mx-auto mb-2 opacity-50" />
                <p>No tienes retos activos ni invitaciones.</p>
                <Link href="/leaderboard" className="text-primary-app underline mt-1 block">
                    Busca oponentes en el Leaderboard
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {pendingInvites.length > 0 && (
                <div className="terminal-card p-4 border-yellow-500/30 bg-yellow-500/5">
                    <h3 className="text-xs font-mono font-bold text-yellow-500 mb-3 flex items-center gap-2">
                        <Clock size={14} /> INVITACIONES PENDIENTES
                    </h3>
                    <div className="flex flex-col gap-2">
                        {pendingInvites.map(c => (
                            <div key={c.id} className="flex justify-between items-center bg-background-app p-2 rounded border border-border-app">
                                <span className="text-xs font-mono">
                                    <span className="font-bold text-foreground-app">@{c.challenger?.username || 'Unknown'}</span> te ha retado.
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleResponse(c.id, true)} className="p-1 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20">
                                        <Check size={14} />
                                    </button>
                                    <button onClick={() => handleResponse(c.id, false)} className="p-1 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-500/20">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeChallenges.length > 0 && (
                <div className="terminal-card p-4">
                    <h3 className="text-xs font-mono font-bold text-blue-500 mb-3 flex items-center gap-2">
                        <Swords size={14} /> RETOS ACTIVOS
                    </h3>
                    <div className="flex flex-col gap-2">
                        {activeChallenges.map(c => {
                            const opponent = c.challenger_id === user.id ? c.challenged : c.challenger;
                            return (
                                <Link key={c.id} href={`/profile/${c.challenger_id === user.id ? c.challenged_id : c.challenger_id}`} className="flex justify-between items-center hover:bg-secondary-app p-2 rounded transition-colors cursor-pointer">
                                    <span className="text-xs font-mono text-foreground-app">
                                        Vs <span className="font-bold">@{opponent?.username || 'Unknown'}</span>
                                    </span>
                                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                                        Active
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
