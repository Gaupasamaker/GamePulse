"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { User, Save, Loader2, AlertCircle, CheckCircle2, MessageSquare, Swords } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChallengesPanel } from '@/components/ChallengesPanel';
import { SocialShareButton } from '@/components/SocialShareButton';

const AVATAR_PRESETS = [
    // Pixel Art "Gamer" style
    "https://api.dicebear.com/9.x/pixel-art/svg?seed=Chase",
    "https://api.dicebear.com/9.x/pixel-art/svg?seed=Brad",
    "https://api.dicebear.com/9.x/pixel-art/svg?seed=Easton",
    "https://api.dicebear.com/9.x/pixel-art/svg?seed=Destini",
    "https://api.dicebear.com/9.x/pixel-art/svg?seed=Jade",
    "https://api.dicebear.com/9.x/pixel-art/svg?seed=Kimberly",
    "https://api.dicebear.com/9.x/pixel-art/svg?seed=Maria",
    "https://api.dicebear.com/9.x/pixel-art/svg?seed=Mason",
    "https://api.dicebear.com/9.x/pixel-art/svg?seed=Brian",
    "https://api.dicebear.com/9.x/pixel-art/svg?seed=George",
    // Bottts for fun
    "https://api.dicebear.com/9.x/bottts/svg?seed=Repo",
    "https://api.dicebear.com/9.x/bottts/svg?seed=Zoom",
];

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [bio, setBio] = useState('');
    const [topPick, setTopPick] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!user) return; // Wait for auth

        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setUsername(data.username || '');
                setAvatarUrl(data.avatar_url || user.user_metadata.avatar_url || AVATAR_PRESETS[0]);
                setBio(data.bio || '');
                setTopPick(data.top_pick || '');
            }
            setLoading(false);
        };

        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setMessage(null);

        if (username.length < 3) {
            setMessage({ type: 'error', text: 'El nombre de usuario debe tener al menos 3 caracteres.' });
            setSaving(false);
            return;
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: username,
                    avatar_url: avatarUrl,
                    bio: bio,
                    top_pick: topPick,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) {
                if (error.code === '23505') { // Unique violation code
                    throw new Error("Este nombre de usuario ya está cogido. ¡Prueba otro!");
                }
                throw error;
            }

            setMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' });
            router.refresh();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Error al guardar el perfil.' });
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="p-8 flex justify-center text-muted-foreground-app font-mono">
                <Loader2 className="animate-spin" /> Cargando sesión...
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-8 flex justify-center text-muted-foreground-app font-mono">
                <Loader2 className="animate-spin" /> Cargando perfil...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-8">
            <div className="flex justify-between items-center border-b border-border-app pb-4">
                <h1 className="text-3xl font-bold font-mono text-foreground-app tracking-tighter">
                    MI PERFIL
                </h1>
                <SocialShareButton
                    title="Share Profile"
                    text={`Check out my investment portfolio on GamePulse! 🚀`}
                    url={typeof window !== 'undefined' ? `${window.location.origin}/profile/${user.id}` : ''}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna Izquierda: Formulario */}
                <div className="flex flex-col gap-6">
                    <div className="terminal-card p-6">
                        <label className="block text-xs font-mono text-muted-foreground-app mb-2 uppercase">Gamer Tag (Username)</label>
                        <div className="flex gap-2 items-center mb-4">
                            <span className="text-blue-500 font-bold">@</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="terminal-input flex-1"
                                placeholder="username"
                            />
                        </div>

                        <label className="block text-xs font-mono text-muted-foreground-app mb-2 uppercase">Bio / Estado</label>
                        <div className="flex gap-2 items-start">
                            <MessageSquare className="text-blue-500 mt-2" size={16} />
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="terminal-input flex-1 h-24 resize-none"
                                placeholder="Escribe algo sobre ti..."
                                maxLength={160}
                            />
                        </div>
                        <p className="text-[10px] text-right text-muted-foreground-app mt-1 font-mono">
                            {bio.length}/160 caracteres
                        </p>

                        <label className="block text-xs font-mono text-muted-foreground-app mb-2 mt-4 uppercase">Top Pick (Acción Favorita)</label>
                        <div className="flex gap-2 items-center">
                            <span className="text-yellow-500 font-bold">$</span>
                            <input
                                type="text"
                                value={topPick}
                                onChange={(e) => setTopPick(e.target.value.toUpperCase())}
                                className="terminal-input w-24 tracking-widest font-bold"
                                placeholder="NVDA"
                                maxLength={5}
                            />
                            <p className="text-[10px] text-muted-foreground-app">
                                Aparecerá destacada en tu perfil.
                            </p>
                        </div>
                    </div>

                    <div className="terminal-card p-6">
                        <label className="block text-xs font-mono text-muted-foreground-app mb-4 uppercase">Avatar Preview</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full border-2 border-primary-app overflow-hidden bg-secondary-app relative">
                                <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-foreground-app font-mono font-bold text-lg">{username || 'Player'}</p>
                                <p className="text-muted-foreground-app text-xs font-mono italic">
                                    {bio || "Sin descripción."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 border rounded font-mono text-sm flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="terminal-btn terminal-btn-primary justify-center h-12 text-base"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                    </button>

                    {/* Activity / Challenges Panel inside Profile */}
                    <div className="mt-4">
                        <h3 className="text-sm font-mono font-bold text-muted-foreground-app mb-4 uppercase flex items-center gap-2">
                            <Swords size={16} className="text-blue-500" /> Mis Retos y Actividad
                        </h3>
                        <div className="terminal-card bg-secondary-app/20 p-4">
                            <ChallengesPanel />
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Selector de Avatares */}
                <div className="terminal-card p-6">
                    <h3 className="text-sm font-mono font-bold text-muted-foreground-app mb-4 uppercase flex items-center gap-2">
                        <User size={16} className="text-purple-400" />
                        Selecciona tu Avatar
                    </h3>

                    <div className="max-h-[240px] overflow-y-auto pr-2 custom-scrollbar border border-border-app/30 rounded p-2 bg-background-app/50">
                        <div className="grid grid-cols-4 gap-3">
                            {AVATAR_PRESETS.map((url, index) => (
                                <button
                                    key={index}
                                    onClick={() => setAvatarUrl(url)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 group relative ${avatarUrl === url
                                        ? 'border-primary-app shadow-[0_0_10px_#3b82f680] ring-1 ring-primary-app'
                                        : 'border-transparent hover:border-gray-600 bg-secondary-app'
                                        }`}
                                >
                                    <img src={url} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
                                    {avatarUrl === url && (
                                        <div className="absolute inset-0 bg-primary-app/20 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-primary-app shadow-[0_0_5px_white]"></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border-app">
                        <details className="group">
                            <summary className="text-[10px] uppercase font-mono text-muted-foreground-app cursor-pointer hover:text-foreground-app flex items-center gap-2 list-none select-none">
                                <span className="text-lg leading-none transition-transform group-open:rotate-90">›</span>
                                Usar URL Personalizada
                            </summary>
                            <div className="mt-2 animate-in slide-in-from-top-2">
                                <input
                                    type="text"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    className="terminal-input w-full text-xs"
                                    placeholder="https://imgur.com/..."
                                />
                                <p className="text-[9px] text-muted-foreground-app mt-1">
                                    Pega la URL de una imagen (JPG, PNG, SVG).
                                </p>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}
