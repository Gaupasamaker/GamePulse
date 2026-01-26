"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { SEED_COMPANIES } from '@/data/companies';
import { useQuotes } from '@/hooks/useQuotes';
import { PieChart, Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Calculator, Cloud, Save } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Position {
    id: string;
    ticker: string;
    shares: number;
    avgCost: number;
}

export const PortfolioSimulator: React.FC = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [positions, setPositions] = useState<Position[]>([]);
    const [newTicker, setNewTicker] = useState('');
    const [newShares, setNewShares] = useState('');
    const [newCost, setNewCost] = useState('');
    const [loadingDb, setLoadingDb] = useState(false);

    // Cargar quotes para todas las posiciones
    const { quotes, loading: loadingQuotes } = useQuotes(positions.map(p => p.ticker));

    // Cargar datos (Nube o Local)
    useEffect(() => {
        const loadPositions = async () => {
            if (user) {
                setLoadingDb(true);
                const { data } = await supabase.from('transactions').select('*');
                if (data) {
                    const cloudPositions = data.map(tx => ({
                        id: tx.id,
                        ticker: tx.ticker,
                        shares: Number(tx.amount), // Postgres numeric viene como string/number dependiendo del driver
                        avgCost: Number(tx.price)
                    }));
                    setPositions(cloudPositions);
                }
                setLoadingDb(false);
            } else {
                // Modo Offline
                const saved = localStorage.getItem('gamepulse_portfolio');
                if (saved) setPositions(JSON.parse(saved));
            }
        };
        loadPositions();
    }, [user]);

    // Función auxiliar para actualizar LocalStorage solo si no hay usuario
    const updateLocal = (items: Position[]) => {
        if (!user) {
            localStorage.setItem('gamepulse_portfolio', JSON.stringify(items));
        }
        setPositions(items);
    };

    const addPosition = async () => {
        if (!newTicker || !newShares || !newCost) return;

        const sharesVal = parseFloat(newShares);
        const costVal = parseFloat(newCost);

        if (user) {
            // Guardar en Nube
            const { data, error } = await supabase.from('transactions').insert({
                user_id: user.id,
                ticker: newTicker,
                amount: sharesVal,
                price: costVal,
                type: 'buy'
            }).select().single();

            if (data && !error) {
                const newPos: Position = {
                    id: data.id,
                    ticker: data.ticker,
                    shares: Number(data.amount),
                    avgCost: Number(data.price)
                };
                setPositions([...positions, newPos]);

                // Actualizar total_equity en perfil (Basic aggregation)
                // En una app real esto se haría con un Trigger o un Edge Function más complejo
            }
        } else {
            // Guardar en Local
            const position: Position = {
                id: Math.random().toString(36).substr(2, 9),
                ticker: newTicker,
                shares: sharesVal,
                avgCost: costVal,
            };
            updateLocal([...positions, position]);
        }

        setNewTicker('');
        setNewShares('');
        setNewCost('');
    };

    const removePosition = async (id: string) => {
        if (user) {
            await supabase.from('transactions').delete().eq('id', id);
            setPositions(positions.filter(p => p.id !== id));
        } else {
            updateLocal(positions.filter(p => p.id !== id));
        }
    };

    // Cálculos
    const totalInvested = positions.reduce((acc, p) => acc + (p.shares * p.avgCost), 0);
    const currentValue = positions.reduce((acc, p) => {
        const price = quotes[p.ticker]?.price || p.avgCost; // Fallback a coste si no hay quote
        return acc + (p.shares * price);
    }, 0);

    const totalGain = currentValue - totalInvested;
    const totalRoi = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="terminal-card p-6 bg-blue-900/10 border-blue-500/30">
                    <h3 className="text-xs font-mono text-blue-400 mb-2">{t('total_value')}</h3>
                    <div className="text-3xl font-bold text-white font-mono flex items-center gap-2">
                        <DollarSign size={24} className="text-blue-500" />
                        {currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="terminal-card p-6">
                    <h3 className="text-xs font-mono text-gray-400 mb-2">{t('roi')}</h3>
                    <div className={cn(
                        "text-3xl font-bold font-mono flex items-center gap-2",
                        totalRoi >= 0 ? "text-emerald-400" : "text-rose-500"
                    )}>
                        {totalRoi >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                        {totalRoi.toFixed(2)}%
                    </div>
                </div>

                <div className="terminal-card p-6">
                    <h3 className="text-xs font-mono text-gray-400 mb-2">{t('gain_loss')}</h3>
                    <div className={cn(
                        "text-3xl font-bold font-mono",
                        totalGain >= 0 ? "text-emerald-400" : "text-rose-500"
                    )}>
                        {totalGain >= 0 ? '+' : ''}{totalGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario */}
                <div className="lg:col-span-1 terminal-card p-6 h-fit">
                    <h3 className="text-sm font-mono font-bold text-white mb-4 flex items-center gap-2">
                        <Calculator size={16} className="text-blue-500" />
                        {t('add_position')}
                    </h3>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-mono uppercase">{t('ticker')}</label>
                            <select
                                className="terminal-input w-full"
                                value={newTicker}
                                onChange={async (e) => {
                                    const t = e.target.value;
                                    setNewTicker(t);
                                    if (t) {
                                        try {
                                            const res = await fetch(`/api/quote/${t}`);
                                            const data = await res.json();
                                            if (data.price) setNewCost(data.price.toFixed(2));
                                        } catch (err) {
                                            console.error("Error fetching price for autofill", err);
                                        }
                                    }
                                }}
                            >
                                <option value="">{t('search_ticker')}</option>
                                {SEED_COMPANIES.map(c => (
                                    <option key={c.ticker} value={c.ticker}>{c.ticker} - {c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-mono uppercase">{t('shares')}</label>
                            <input
                                type="number"
                                className="terminal-input w-full"
                                placeholder="0"
                                value={newShares}
                                onChange={(e) => setNewShares(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-mono uppercase">{t('avg_cost')}</label>
                            <input
                                type="number"
                                className="terminal-input w-full"
                                placeholder="0.00"
                                value={newCost}
                                onChange={(e) => setNewCost(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={addPosition}
                            disabled={!newTicker || !newShares || !newCost}
                            className="terminal-btn terminal-btn-primary w-full justify-center mt-2"
                        >
                            <Plus size={16} /> {t('add_position')}
                        </button>
                    </div>
                </div>

                {/* Tabla de Posiciones */}
                <div className="lg:col-span-2 terminal-card overflow-hidden">
                    <div className="p-4 border-b border-border-app bg-black/20 flex justify-between items-center">
                        <h3 className="text-sm font-mono font-bold text-gray-400 flex items-center gap-2">
                            <PieChart size={16} className="text-emerald-500" />
                            {t('my_positions')}
                        </h3>
                        {user ? (
                            <div className="text-[10px] text-blue-400 font-mono flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                <Cloud size={10} /> CLOUD SYNC ON
                            </div>
                        ) : (
                            <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                                <Save size={10} /> LOCAL STORAGE
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-xs">
                            <thead>
                                <tr className="bg-black/40 border-b border-border-app">
                                    <th className="px-4 py-3 text-gray-500">{t('ticker')}</th>
                                    <th className="px-4 py-3 text-right text-gray-500">{t('shares')}</th>
                                    <th className="px-4 py-3 text-right text-gray-500">{t('avg_cost')}</th>
                                    <th className="px-4 py-3 text-right text-gray-500">{t('price')}</th>
                                    <th className="px-4 py-3 text-right text-gray-500">{t('market_value')}</th>
                                    <th className="px-4 py-3 text-right text-gray-500">{t('roi')}</th>
                                    <th className="px-4 py-3 text-center text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-app/50">
                                {positions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500 italic">
                                            NO POSITIONS OPENED
                                        </td>
                                    </tr>
                                ) : (
                                    positions.map(p => {
                                        const quote = quotes[p.ticker];
                                        const price = quote?.price || 0;
                                        const marketValue = price * p.shares;
                                        const gain = marketValue - (p.shares * p.avgCost);
                                        const roi = p.avgCost > 0 ? (gain / (p.shares * p.avgCost)) * 100 : 0;

                                        return (
                                            <tr key={p.id} className="hover:bg-white/5">
                                                <td className="px-4 py-3 font-bold text-white">{p.ticker}</td>
                                                <td className="px-4 py-3 text-right text-gray-300">{p.shares}</td>
                                                <td className="px-4 py-3 text-right text-gray-300">${p.avgCost.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right text-white">
                                                    {loadingQuotes ? <span className="animate-pulse">...</span> : `$${price.toFixed(2)}`}
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-white">
                                                    ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className={cn(
                                                    "px-4 py-3 text-right font-bold",
                                                    roi >= 0 ? "text-emerald-400" : "text-rose-500"
                                                )}>
                                                    {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => removePosition(p.id)}
                                                        className="text-gray-600 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
