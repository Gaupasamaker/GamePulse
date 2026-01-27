"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { User, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
            <h1 className="text-3xl font-bold font-mono text-foreground-app tracking-tighter border-b border-border-app pb-4">
                EDITAR PERFIL
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna Izquierda: Formulario */}
                <div className="flex flex-col gap-6">
                    <div className="terminal-card p-6">
                        <label className="block text-xs font-mono text-muted-foreground-app mb-2 uppercase">Gamer Tag (Username)</label>
                        <div className="flex gap-2 items-center">
                            <span className="text-blue-500 font-bold">@</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="terminal-input flex-1"
                                placeholder="username"
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground-app mt-2 font-mono">
                            Este nombre aparecerá en el Leaderboard global.
                        </p>
                    </div>

                    <div className="terminal-card p-6">
                        <label className="block text-xs font-mono text-muted-foreground-app mb-4 uppercase">Avatar Preview</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full border-2 border-primary-app overflow-hidden bg-secondary-app relative">
                                <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-foreground-app font-mono font-bold text-lg">{username || 'Player'}</p>
                                <p className="text-muted-foreground-app text-xs font-mono">Nivel 1 • Inversor Novato</p>
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
                </div>

                {/* Columna Derecha: Selector de Avatares */}
                <div className="terminal-card p-6">
                    <h3 className="text-sm font-mono font-bold text-muted-foreground-app mb-4 uppercase flex items-center gap-2">
                        <User size={16} className="text-purple-400" />
                        Selecciona tu Avatar
                    </h3>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {AVATAR_PRESETS.map((url, index) => (
                            <button
                                key={index}
                                onClick={() => setAvatarUrl(url)}
                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${avatarUrl === url
                                    ? 'border-primary-app shadow-[0_0_10px_#3b82f680]'
                                    : 'border-transparent hover:border-gray-600 bg-secondary-app'
                                    }`}
                            >
                                <img src={url} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-border-app">
                        <label className="block text-xs font-mono text-muted-foreground-app mb-2">O pega una URL personalizada:</label>
                        <input
                            type="text"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="terminal-input w-full text-xs"
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
