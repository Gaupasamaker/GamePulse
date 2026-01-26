"use client";

import React, { useState } from 'react';
import { Shield, LayoutGrid, Plus, Edit2, Trash2, Globe, Tag, Save, X } from 'lucide-react';
import { SEED_COMPANIES, Company } from '@/data/companies';
import { useLanguage } from '@/providers/LanguageProvider';

export default function AdminPage() {
    const [companies, setCompanies] = useState<Company[]>(SEED_COMPANIES);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Company | null>(null);
    const { t } = useLanguage();

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

    return (
        <div className="p-6 max-w-6xl mx-auto flex flex-col gap-8">
            <section className="border-l-2 border-emerald-500 pl-4 py-2 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-white tracking-tighter flex items-center gap-3">
                        <Shield className="text-emerald-500" />
                        {t('admin_panel')}
                    </h1>
                    <p className="text-sm text-gray-500 font-mono mt-1">
                        Gestión del universo de empresas gaming y categorización.
                    </p>
                </div>
                <button className="terminal-btn terminal-btn-primary">
                    <Plus size={16} /> {t('add_entity')}
                </button>
            </section>

            <div className="terminal-card overflow-hidden">
                <table className="w-full text-left font-mono text-xs">
                    <thead>
                        <tr className="border-b border-border-app bg-black/40">
                            <th className="px-4 py-3 font-semibold text-gray-500">ID / {t('ticker')}</th>
                            <th className="px-4 py-3 font-semibold text-gray-500">Company Name</th>
                            <th className="px-4 py-3 font-semibold text-gray-500">{t('category')}</th>
                            <th className="px-4 py-3 font-semibold text-gray-500">Region</th>
                            <th className="px-4 py-3 font-semibold text-right text-gray-500">Status</th>
                            <th className="px-4 py-3 font-semibold text-center text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-app/50">
                        {companies.map((company) => (
                            <tr key={company.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold">{company.ticker}</span>
                                        <span className="text-[9px] text-gray-500">{company.exchange}</span>
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
                                        <span className="text-gray-300">{company.name}</span>
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
                                        <Globe size={12} className="text-gray-500" />
                                        <span className="text-gray-400">{company.region}</span>
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
                                                <button onClick={() => startEdit(company)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded">
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

            <div className="terminal-card border-dashed p-6 bg-black/40">
                <h3 className="text-xs font-mono font-bold text-gray-400 mb-2 uppercase flex items-center gap-2">
                    <Shield size={14} className="text-blue-500" /> Administrative_Notice
                </h3>
                <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                    Los cambios realizados aquí en el MVP son temporales (estado local de React).
                    Para persistencia real, configure un adaptador de Supabase/Firebase en [lib/db_adapter.ts].
                    Todas las entidades deben pertenecer exclusivamente al sector de videojuegos.
                </p>
            </div>
        </div>
    );
}
