"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Calendar as CalendarIcon, DollarSign, Gamepad2, Loader2 } from 'lucide-react';

interface CalendarEvent {
    id: string;
    date: Date;
    ticker?: string;
    title: string;
    type: 'earnings' | 'release';
    impact: 'High' | 'Medium' | 'Low';
}

// Datos simulados para lanzamientos (ya que no hay API pública fácil para esto en el scope)
const GAME_RELEASES: CalendarEvent[] = [
    { id: '1', date: new Date('2026-02-14'), title: 'Civilization VII', type: 'release', impact: 'High' },
    { id: '2', date: new Date('2026-02-28'), title: 'Monster Hunter Wilds (Capcom)', type: 'release', impact: 'High' },
    { id: '3', date: new Date('2026-03-10'), title: 'GTA VI (Trailer 3)', type: 'release', impact: 'Medium' },
    { id: '4', date: new Date('2026-03-24'), title: 'Resident Evil 9', type: 'release', impact: 'High' },
];

export const EventsCalendar: React.FC = () => {
    const { t } = useLanguage();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            // Simulamos fetch de earnings usando los datos de Quote si tienen earningsTimestamp
            // En una app real, haríamos un endpoint específico que barra todos los tickers
            try {
                // Mock smart earnings dates based on current month for demo
                const today = new Date();
                const earnings: CalendarEvent[] = [
                    { id: 'e1', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), ticker: 'SONY', title: 'Q3 Earnings Call', type: 'earnings', impact: 'High' },
                    { id: 'e2', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12), ticker: 'NVDA', title: 'Q4 Financial Results', type: 'earnings', impact: 'High' },
                    { id: 'e3', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 18), ticker: 'NTDOY', title: 'Fiscal Year Update', type: 'earnings', impact: 'Medium' },
                    { id: 'e4', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 25), ticker: 'EA', title: 'Quarterly Earnings', type: 'earnings', impact: 'Medium' },
                ];

                const allEvents = [...earnings, ...GAME_RELEASES].sort((a, b) => a.date.getTime() - b.date.getTime());
                setEvents(allEvents);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'Low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1: Earnings */}
            <div className="terminal-card p-6">
                <h3 className="text-sm font-mono font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    <DollarSign size={16} />
                    {t('upcoming_earnings')}
                </h3>

                {loading ? (
                    <Loader2 className="animate-spin text-gray-500" />
                ) : (
                    <div className="flex flex-col gap-3">
                        {events.filter(e => e.type === 'earnings').map(e => (
                            <div key={e.id} className="flex items-center justify-between p-3 bg-black/20 border border-border-app rounded hover:border-emerald-500/50 transition-colors">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white font-mono">{e.ticker}</span>
                                        <span className="text-[10px] text-gray-500">{formatDate(e.date)}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{e.title}</span>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getImpactColor(e.impact)}`}>
                                    {e.impact} {t('impact').split(' ')[0]}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Column 2: Releases */}
            <div className="terminal-card p-6">
                <h3 className="text-sm font-mono font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <Gamepad2 size={16} />
                    {t('game_releases')}
                </h3>

                <div className="flex flex-col gap-3">
                    {events.filter(e => e.type === 'release').map(e => (
                        <div key={e.id} className="flex items-center justify-between p-3 bg-black/20 border border-border-app rounded hover:border-blue-500/50 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-bold text-white text-sm">{e.title}</span>
                                <span className="text-[10px] text-gray-500 font-mono">{formatDate(e.date)}</span>
                            </div>
                            <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getImpactColor(e.impact)}`}>
                                {e.impact} INT
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
