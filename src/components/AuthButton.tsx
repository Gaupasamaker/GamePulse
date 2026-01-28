"use client";

import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, Trophy, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

import { AuthModal } from './AuthModal';

export const AuthButton = () => {
    const { user, signOut, loading } = useAuth();
    const { t } = useLanguage();
    const [avatar, setAvatar] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            // 1. Fetch initial profile data
            const fetchProfile = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('avatar_url, username')
                    .eq('id', user.id)
                    .single();

                setAvatar(data?.avatar_url || user.user_metadata.avatar_url);
                setUsername(data?.username || user.user_metadata.full_name);
            };
            fetchProfile();

            // 2. Subscribe to realtime changes
            const channel = supabase
                .channel('profile_changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'profiles',
                        filter: `id=eq.${user.id}`
                    },
                    (payload) => {
                        if (payload.new) {
                            if ('avatar_url' in payload.new) setAvatar(payload.new.avatar_url as string);
                            if ('username' in payload.new) setUsername(payload.new.username as string);
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user]);

    if (loading) return <div className="w-8 h-8 rounded-full bg-secondary-app animate-pulse" />;

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group relative">
                    {/* Avatar */}
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={user.user_metadata.full_name}
                            className="w-8 h-8 rounded-full border border-border-app object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-app flex items-center justify-center text-primary-foreground-app border border-primary-app/50">
                            <span className="font-mono text-xs">{user.email?.[0].toUpperCase()}</span>
                        </div>
                    )}

                    {/* Dropdown Menu (Simple) */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-popover-app border border-border-app rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                        <div className="p-3 border-b border-border-app">
                            <p className="text-xs text-muted-foreground-app font-mono">Signed in as</p>
                            <p className="text-sm font-bold truncate">{username || user.user_metadata.full_name || user.email}</p>
                        </div>
                        <Link
                            href="/profile"
                            className="w-full text-left px-4 py-2 text-sm text-muted-foreground-app hover:text-foreground-app hover:bg-secondary-app flex items-center gap-2 transition-colors"
                        >
                            <UserIcon size={14} /> Profile
                        </Link>
                        <button
                            onClick={signOut}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                        >
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-app text-primary-foreground-app text-xs font-bold font-mono rounded hover:brightness-110 transition-colors"
            >
                <LogIn size={14} />
                LOGIN
            </button>
            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};
