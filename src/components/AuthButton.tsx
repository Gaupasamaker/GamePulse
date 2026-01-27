"use client";

import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, Trophy, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const AuthButton = () => {
    const { user, signInWithGoogle, signOut, loading } = useAuth();
    const { t } = useLanguage();
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            // Check for custom avatar in profile
            const fetchAvatar = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('avatar_url')
                    .eq('id', user.id)
                    .single();

                setAvatar(data?.avatar_url || user.user_metadata.avatar_url);
            };
            fetchAvatar();
        }
    }, [user]);

    if (loading) return <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />;

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group relative">
                    {/* Avatar */}
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={user.user_metadata.full_name}
                            className="w-8 h-8 rounded-full border border-white/10 object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white border border-blue-400">
                            <span className="font-mono text-xs">{user.email?.[0].toUpperCase()}</span>
                        </div>
                    )}

                    {/* Dropdown Menu (Simple) */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-black border border-border-app rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                        <div className="p-3 border-b border-border-app">
                            <p className="text-xs text-gray-400 font-mono">Signed in as</p>
                            <p className="text-sm font-bold truncate">{user.user_metadata.full_name || user.email}</p>
                        </div>
                        <Link
                            href="/profile"
                            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
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
        <button
            onClick={signInWithGoogle}
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-black text-xs font-bold font-mono rounded hover:bg-gray-200 transition-colors"
        >
            <LogIn size={14} />
            LOGIN
        </button>
    );
};
