"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Trash2, Plus, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { SEED_COMPANIES } from '@/data/companies';
import { useLanguage } from '@/providers/LanguageProvider';

interface Alert {
    id: string;
    ticker: string;
    type: 'price' | 'keyword';
    value: string;
    active: boolean;
    createdAt: number;
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [newTicker, setNewTicker] = useState('');
    const [newType, setNewType] = useState<'price' | 'keyword'>('price');
    const [newValue, setNewValue] = useState('');
    const { t } = useLanguage();

    useEffect(() => {
        const saved = localStorage.getItem('gamepulse_alerts');
        if (saved) setAlerts(JSON.parse(saved));
    }, []);

    const saveAlerts = (updated: Alert[]) => {
        setAlerts(updated);
        localStorage.setItem('gamepulse_alerts', JSON.stringify(updated));
    };

    const addAlert = () => {
        if (!newTicker || !newValue) return;
        const alert: Alert = {
            id: Math.random().toString(36).substr(2, 9),
            ticker: newTicker,
            type: newType,
            value: newValue,
            active: true,
            createdAt: Date.now(),
        };
        saveAlerts([alert, ...alerts]);
        setNewTicker('');
        setNewValue('');
    };

    const toggleAlert = (id: string) => {
        saveAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
    };

    const deleteAlert = (id: string) => {
        saveAlerts(alerts.filter(a => a.id !== id));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto flex flex-col gap-8">
            <section className="border-l-2 border-blue-600 pl-4 py-2">
                <h1 className="text-2xl font-bold font-mono text-white tracking-tighter">
                    {t('alerts_manager')}
                </h1>
                <p className="text-sm text-gray-500 font-mono mt-1">
                    Configura notificaciones para eventos críticos en el mercado gaming.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Alert */}
                <div className="md:col-span-1 flex flex-col gap-4">
                    <div className="terminal-card p-4 flex flex-col gap-4">
                        <h2 className="text-[10px] font-mono font-bold text-blue-400 uppercase flex items-center gap-2">
                            <Plus size={14} /> {t('configure_alert')}
                        </h2>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-mono uppercase">{t('ticker')}</label>
                            <select
                                className="terminal-input w-full"
                                value={newTicker}
                                onChange={(e) => setNewTicker(e.target.value)}
                            >
                                <option value="">{t('search_ticker')}</option>
                                {SEED_COMPANIES.map(c => <option key={c.ticker} value={c.ticker}>{c.ticker} ({c.name})</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-mono uppercase">{t('type')}</label>
                            <div className="flex bg-black rounded p-1 border border-border-app">
                                <button
                                    onClick={() => setNewType('price')}
                                    className={`flex-1 py-1 text-[10px] font-mono rounded ${newType === 'price' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                                >
                                    PRICE %
                                </button>
                                <button
                                    onClick={() => setNewType('keyword')}
                                    className={`flex-1 py-1 text-[10px] font-mono rounded ${newType === 'keyword' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                                >
                                    KEYWORD
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-mono uppercase">
                                {newType === 'price' ? 'Percent Threshold' : 'Keyword Pattern'}
                            </label>
                            <input
                                type="text"
                                placeholder={newType === 'price' ? 'e.g. 5' : 'e.g. "Acquisition"'}
                                className="terminal-input w-full"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={addAlert}
                            disabled={!newTicker || !newValue}
                            className="terminal-btn terminal-btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                        >
                            {t('create_alert')}
                        </button>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-md">
                        <h3 className="text-[10px] font-mono text-blue-400 flex items-center gap-2 mb-2">
                            <Info size={12} /> MVP_LIMITATION
                        </h3>
                        <p className="text-[10px] text-gray-500 font-mono leading-normal">
                            Las alertas actuales se almacenan localmente. En el MVP solo verás badges de notificación in-app.
                        </p>
                    </div>
                </div>

                {/* List Alerts */}
                <div className="md:col-span-2 flex flex-col gap-4">
                    <h2 className="text-[10px] font-mono font-bold text-gray-500 uppercase flex items-center gap-2">
                        <Bell size={14} /> {t('active_alerts')} ({alerts.length})
                    </h2>

                    <div className="flex flex-col gap-3">
                        {alerts.length === 0 ? (
                            <div className="terminal-card border-dashed p-12 text-center text-gray-500 font-mono text-xs">
                                SYSTEM_IDLE: NO_ALERTS_CONFIGURED
                            </div>
                        ) : (
                            alerts.map((alert) => (
                                <div key={alert.id} className={`terminal-card p-4 flex items-center justify-between border-l-4 ${alert.active ? 'border-l-emerald-500' : 'border-l-gray-600'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${alert.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-500'}`}>
                                            <Bell size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-bold font-mono">{alert.ticker}</span>
                                                <span className="text-[10px] text-gray-500 font-mono uppercase">
                                                    {alert.type === 'price' ? 'CHG_PERCENT' : 'NEWS_KEYWORD'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-blue-400 font-mono">
                                                {alert.type === 'price' ? `TRIGGER: > ${alert.value}%` : `PATTERN: "${alert.value}"`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleAlert(alert.id)}
                                            className={`text-[10px] font-mono px-3 py-1 rounded transition-colors ${alert.active ? 'bg-black text-emerald-400 border border-emerald-500/20 hover:border-emerald-500' : 'bg-black text-gray-500 border border-gray-600/20 hover:border-gray-500'}`}
                                        >
                                            {alert.active ? 'ENABLED' : 'DISABLED'}
                                        </button>
                                        <button
                                            onClick={() => deleteAlert(alert.id)}
                                            className="p-2 text-gray-500 hover:text-rose-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
