"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

export const MarketBriefing: React.FC = () => {
    const { t } = useLanguage();
    const [status, setStatus] = useState<'bullish' | 'bearish' | 'mixed'>('mixed');
    const [avgChange, setAvgChange] = useState(0);

    useEffect(() => {
        const analyzeMarket = async () => {
            // Usamos un proxy del mercado: Promedio de MSFT, SONY, NVDA, NTDOY
            const proxyTickers = ['MSFT', 'SONY', 'NVDA', 'NTDOY'];
            let totalChange = 0;
            let count = 0;

            try {
                // Fetch paralelo
                const promises = proxyTickers.map(t => fetch(`/api/quote/${t}`).then(r => r.json()));
                const results = await Promise.all(promises);

                results.forEach(q => {
                    if (q.changePercent !== undefined) {
                        totalChange += q.changePercent;
                        count++;
                    }
                });

                if (count > 0) {
                    const avg = totalChange / count;
                    setAvgChange(avg);
                    if (avg > 0.5) setStatus('bullish');
                    else if (avg < -0.5) setStatus('bearish');
                    else setStatus('mixed');
                }
            } catch (e) {
                console.error("Error analyzing market:", e);
            }
        };

        analyzeMarket();
    }, []);

    const getStatusConfig = () => {
        switch (status) {
            case 'bullish': return {
                icon: <TrendingUp className="text-emerald-400" size={20} />,
                title: t('briefing_bullish'),
                desc: t('briefing_bullish_desc'),
                color: 'border-emerald-500/30 bg-emerald-500/5'
            };
            case 'bearish': return {
                icon: <TrendingDown className="text-rose-400" size={20} />,
                title: t('briefing_bearish'),
                desc: t('briefing_bearish_desc'),
                color: 'border-rose-500/30 bg-rose-500/5'
            };
            default: return {
                icon: <Minus className="text-yellow-400" size={20} />,
                title: t('briefing_mixed'),
                desc: t('briefing_mixed_desc'),
                color: 'border-yellow-500/30 bg-yellow-500/5'
            };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`terminal-card p-4 border-l-4 ${config.color} flex items-center justify-between`}>
            <div className="flex items-center gap-4">
                <div className="p-2 bg-black/20 rounded-full">
                    {config.icon}
                </div>
                <div className="flex flex-col">
                    <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                        {t('market_briefing')}
                        <span className={`text-xs ml-2 px-2 py-0.5 rounded border ${status === 'bullish' ? 'border-emerald-500 text-emerald-500' : status === 'bearish' ? 'border-rose-500 text-rose-500' : 'border-yellow-500 text-yellow-500'}`}>
                            {avgChange > 0 ? '+' : ''}{avgChange.toFixed(2)}%
                        </span>
                    </h3>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                        {config.title}: {config.desc}
                    </p>
                </div>
            </div>
            <Zap size={16} className="text-gray-600 hidden md:block" />
        </div>
    );
};
