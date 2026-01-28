"use client";

import React, { useState } from 'react';
import { Shield, LayoutGrid, Plus, Edit2, Trash2, Globe, Tag, Save, X, User } from 'lucide-react';
import { SEED_COMPANIES, Company } from '@/data/companies';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { IS_ADMIN } from '@/lib/config';
import { BadgeAwarder } from '@/components/BadgeAwarder';

export default function AdminPage() {
    const [companies, setCompanies] = useState<Company[]>(SEED_COMPANIES);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'companies' | 'users'>('companies');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Company | null>(null);
    const { t } = useLanguage();
    const { user, loading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading) {
            if (!IS_ADMIN(user?.email)) {
                router.push('/');
            } else {
                fetchProfiles();
            }
        }
    }, [user, loading, router]);

    const fetchProfiles = async () => {
        import('@/lib/supabase').then(async ({ supabase }) => {
            const { data } = await supabase.from('profiles').select('*').order('total_equity', { ascending: false });
            if (data) setProfiles(data);
        });
    };

    if (loading || !IS_ADMIN(user?.email)) {
        return null; // O un spinner
    }

    const startEdit = (company: Company) => {
        setEditingId(company.id);
        setEditForm({ ...company });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const saveEdit = () => {
        if (!editForm) return;
        setCompanies(companies.map(c => c.id === editForm.id ? editForm : c));
        cancelEdit();
    };

    const deleteCompany = (id: string) => {
        if (confirm('¿Confirmar eliminación de la empresa del universo de monitoreo?')) {
            setCompanies(companies.filter(c => c.id !== id));
        }
    };

    const deleteUser = async (id: string, username: string) => {
        if (!confirm(`¿Estás SEGURO de que quieres eliminar al usuario "${username}"? Esta acción no se puede deshacer.`)) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok) {
                alert(data.message || 'Usuario eliminado');
                setProfiles(profiles.filter(p => p.id !== id));
            } else {
                alert('Error: ' + data.error);
            }
        } catch (e) {
            alert('Error de conexión al eliminar usuario');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto flex flex-col gap-8">
            <section className="border-l-2 border-emerald-500 pl-4 py-2 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-foreground-app tracking-tighter flex items-center gap-3">
                        <Shield className="text-emerald-500" />
                        {t('admin_panel')}
                    </h1>
                    <p className="text-sm text-muted-foreground-app font-mono mt-1">
                        Gestión del universo de empresas gaming y usuarios.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => setActiveTab('companies')}
                            className={`text-xs font-mono px-3 py-1 rounded-sm border ${activeTab === 'companies' ? 'bg-primary-app text-primary-foreground-app border-primary-app' : 'border-border-app text-muted-foreground-app hover:text-foreground-app'}`}
                        >
                            COMPANIES DB
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`text-xs font-mono px-3 py-1 rounded-sm border ${activeTab === 'users' ? 'bg-primary-app text-primary-foreground-app border-primary-app' : 'border-border-app text-muted-foreground-app hover:text-foreground-app'}`}
                        >
                            USER MANAGEMENT
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    {activeTab === 'users' && (
                        <>
                            <button
                                onClick={async () => {
                                    if (!confirm('¿Generar 10 usuarios de prueba? Esto llenará el Leaderboard.')) return;
                                    try {
                                        const res = await fetch('/api/admin/populate', { method: 'POST' });
                                        const data = await res.json();
                                        if (res.ok) {
                                            alert(data.message);
                                            fetchProfiles();
                                        } else {
                                            alert('Error: ' + data.error);
                                        }
                                    } catch (e) {
                                        alert('Error de conexión');
                                    }
                                }}
                                className="terminal-btn terminal-btn-secondary"
                            >
                                <User size={16} /> POPULATE
                            </button>
                            <button
                                onClick={async () => {
                                    if (!confirm('¿Seguro que quieres eliminar a todos los usuarios fantasma? Los usuarios reales NO se verán afectados.')) return;
                                    try {
                                        const res = await fetch('/api/admin/populate', { method: 'DELETE' });
                                        const data = await res.json();
                                        if (res.ok) {
                                            alert(data.message);
                                            fetchProfiles();
                                        } else {
                                            // Mensaje de error detallado
                                            let errorMsg = `Error: ${data.error}`;
                                            if (data.debug) {
                                                errorMsg += `\n\nDebug Info:\nKey Present: ${data.debug.key_present}\nKey Length: ${data.debug.key_length}\nURL: ${data.debug.url}`;
                                            }
                                            alert(errorMsg);
                                        }
                                    } catch (e) {
                                        alert('Error de conexión');
                                    }
                                }}
                                className="terminal-btn bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20"
                            >
                                <Trash2 size={16} /> WIPE BOTS
                            </button>
                        </>
                    )}
                    {activeTab === 'companies' && (
                        <button className="terminal-btn terminal-btn-primary">
                            <Plus size={16} /> {t('add_entity')}
                        </button>
                    )}
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <BadgeAwarder />
                {/* Place for future admin tools */}
            </section>

            {activeTab === 'companies' ? (
                <div className="terminal-card overflow-hidden">
                    <table className="w-full text-left font-mono text-xs">
                        <thead>
                            <tr className="border-b border-border-app bg-secondary-app">
                                <th className="px-4 py-3 font-semibold text-muted-foreground-app">ID / {t('ticker')}</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground-app">Company Name</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground-app">{t('category')}</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground-app">Region</th>
                                <th className="px-4 py-3 font-semibold text-right text-muted-foreground-app">Status</th>
                                <th className="px-4 py-3 font-semibold text-center text-muted-foreground-app">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-app/50">
                            {companies.map((company) => (
                                <tr key={company.id} className="hover:bg-secondary-app transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-foreground-app font-bold">{company.ticker}</span>
                                            <span className="text-[9px] text-muted-foreground-app">{company.exchange}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        {editingId === company.id ? (
                                            <input
                                                className="terminal-input w-full"
                                                value={editForm?.name}
                                                onChange={e => setEditForm(prev => prev ? { ...prev, name: e.target.value } : null)}
                                            />
                                        ) : (
                                            <span className="text-muted-foreground-app">{company.name}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Tag size={12} className="text-blue-500" />
                                            <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[10px] border border-blue-500/20">
                                                {company.category}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Globe size={12} className="text-muted-foreground-app" />
                                            <span className="text-muted-foreground-app">{company.region}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <span className="text-emerald-500 flex items-center justify-end gap-1">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            {t('monitored')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {editingId === company.id ? (
                                                <>
                                                    <button onClick={saveEdit} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded">
                                                        <Save size={16} />
                                                    </button>
                                                    <button onClick={cancelEdit} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded">
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEdit(company)} className="p-1.5 text-muted-foreground-app hover:text-foreground-app hover:bg-secondary-app rounded">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => deleteCompany(company.id)} className="p-1.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/5 rounded">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="terminal-card overflow-hidden">
                    <table className="w-full text-left font-mono text-xs">
                        <thead>
                            <tr className="border-b border-border-app bg-secondary-app">
                                <th className="px-4 py-3 font-semibold text-muted-foreground-app">User</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground-app">Equity</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground-app">Points</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground-app">Joined</th>
                                <th className="px-4 py-3 font-semibold text-center text-muted-foreground-app">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-app/50">
                            {profiles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground-app italic">
                                        No users found.
                                    </td>
                                </tr>
                            ) : profiles.map((p) => (
                                <tr key={p.id} className="hover:bg-secondary-app transition-colors">
                                    <td className="px-4 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-secondary-app border border-border-app overflow-hidden flex-shrink-0">
                                            <img src={p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`} alt={p.username} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-foreground-app font-bold">{p.username || 'Anonymous'}</span>
                                            <span className="text-[9px] text-muted-foreground-app font-mono truncate max-w-[120px]">{p.id}</span>
                                        </div>
                                        {p.avatar_url?.includes('dicebear') && (
                                            <span className="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1 rounded">BOT?</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 font-mono text-emerald-400">
                                        ${p.total_equity?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-4 font-mono text-amber-400">
                                        {p.ranking_points} pts
                                    </td>
                                    <td className="px-4 py-4 text-muted-foreground-app">
                                        {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            onClick={() => deleteUser(p.id, p.username)}
                                            className="p-1.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/5 rounded transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div >
    );
}
