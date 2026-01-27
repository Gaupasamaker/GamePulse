"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase, Alert } from '@/lib/supabase';
import { Bell, Trash2, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useQuotes } from '@/hooks/useQuotes';
import { SEED_COMPANIES } from '@/data/companies';

export const AlertsPanel: React.FC = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [newTicker, setNewTicker] = useState('');
    const [newType, setNewType] = useState<'price_above' | 'price_below'>('price_above');
    const [newValue, setNewValue] = useState('');

    // Fetch Alerts
    useEffect(() => {
        if (!user) return;
        const fetchAlerts = async () => {
            setLoading(true);
            const { data } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
            if (data) setAlerts(data);
            setLoading(false);
        };
        fetchAlerts();
    }, [user]);

    // Quotes for checking triggered status (visual only here)
    const { quotes } = useQuotes(alerts.map(a => a.ticker));

    const addAlert = async () => {
        if (!user || !newTicker || !newValue) return;

        const val = parseFloat(newValue);
        const { data, error } = await supabase.from('alerts').insert({
            user_id: user.id,
            ticker: newTicker,
            type: newType,
            value: val
        }).select().single();

        if (data && !error) {
            setAlerts([data, ...alerts]);
            setNewTicker('');
            setNewValue('');
        }
    };

    const deleteAlert = async (id: string) => {
        await supabase.from('alerts').delete().eq('id', id);
        setAlerts(alerts.filter(a => a.id !== id));
    };

    if (!user) return null;

    return (
        <div className="terminal-card p-4 flex flex-col gap-4 h-full">
            <h3 className="text-sm font-mono font-bold text-muted-foreground-app flex items-center gap-2">
                <Bell size={16} className="text-yellow-500" />
                ALERTS CENTER
            </h3>

            {/* Form */}
            <div className="flex flex-col gap-2 bg-secondary-app p-3 rounded border border-border-app">
                <div className="flex gap-2">
                    <select
                        className="terminal-input w-24 text-[10px]"
                        value={newTicker}
                        onChange={(e) => setNewTicker(e.target.value)}
                    >
                        <option value="">Ticker</option>
                        {SEED_COMPANIES.map(c => <option key={c.ticker} value={c.ticker}>{c.ticker}</option>)}
                    </select>
                    <select
                        className="terminal-input flex-1 text-[10px]"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                    >
                        <option value="price_above">Price Above (&gt;)</option>
                        <option value="price_below">Price Below (&lt;)</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <input
                        type="number"
                        className="terminal-input flex-1 py-1"
                        placeholder="Target Price"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                    />
                    <button
                        onClick={addAlert}
                        disabled={!newTicker || !newValue}
                        className="terminal-btn terminal-btn-primary px-3"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[200px]">
                {loading ? (
                    <div className="text-center text-muted-foreground-app text-xs py-4">Loading alerts...</div>
                ) : alerts.length === 0 ? (
                    <div className="text-center text-muted-foreground-app text-xs py-4 italic">No active alerts</div>
                ) : (
                    alerts.map(alert => {
                        const quote = quotes[alert.ticker];
                        const currentPrice = quote?.price || 0;
                        let triggered = false;
                        if (currentPrice > 0) {
                            if (alert.type === 'price_above' && currentPrice >= alert.value) triggered = true;
                            if (alert.type === 'price_below' && currentPrice <= alert.value) triggered = true;
                        }

                        return (
                            <div key={alert.id} className={`p-2 rounded border flex items-center justify-between group ${triggered ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-secondary-app border-border-app'}`}>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-foreground-app text-xs">{alert.ticker}</span>
                                        <span className="text-[10px] text-muted-foreground-app font-mono">
                                            {alert.type === 'price_above' ? '>' : '<'} ${alert.value}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px]">
                                        <span className="text-muted-foreground-app">Curr: ${currentPrice.toFixed(2)}</span>
                                        {triggered && (
                                            <span className="text-yellow-400 font-bold flex items-center gap-1 animate-pulse">
                                                <AlertTriangle size={8} /> TRIGGERED
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteAlert(alert.id)}
                                    className="text-muted-foreground-app hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all px-2"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
