"use client";

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { SEED_COMPANIES } from '@/data/companies';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Loader2 } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const ComparisonChart: React.FC = () => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const [tickerA, setTickerA] = useState('SONY');
    const [tickerB, setTickerB] = useState('NTDOY');
    const [dataA, setDataA] = useState<any[]>([]);
    const [dataB, setDataB] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [resA, resB] = await Promise.all([
                    fetch(`/api/history/${tickerA}`),
                    fetch(`/api/history/${tickerB}`)
                ]);

                const jsonA = await resA.json();
                const jsonB = await resB.json();

                setDataA(jsonA);
                setDataB(jsonB);
            } catch (e) {
                console.error("Error fetching comparison data", e);
            } finally {
                setLoading(false);
            }
        };

        if (tickerA && tickerB) fetchData();
    }, [tickerA, tickerB]);

    // Normalizar datos (base 0%)
    const normalize = (data: any[]) => {
        if (!data || data.length === 0) return [];
        const base = data[0].close;
        return data.map(d => ({
            x: d.date,
            y: ((d.close - base) / base) * 100
        }));
    };

    const normA = normalize(dataA);
    const normB = normalize(dataB);

    // Labels comunes (usamos las fechas del más largo o A)
    const labels = normA.map(d => d.x);

    const chartData = {
        labels,
        datasets: [
            {
                label: tickerA,
                data: normA.map(d => d.y),
                borderColor: 'rgb(59, 130, 246)', // Blue
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.2,
                pointRadius: 0
            },
            {
                label: tickerB,
                data: normB.map(d => d.y),
                borderColor: 'rgb(16, 185, 129)', // Emerald
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.2,
                pointRadius: 0
            }
        ]
    };

    const options = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: theme === 'dark' ? '#9ca3af' : '#6b7280', font: { family: 'monospace' } }
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                ticks: { color: theme === 'dark' ? '#6b7280' : '#4b5563', maxTicksLimit: 8 }
            },
            y: {
                grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                ticks: {
                    color: theme === 'dark' ? '#6b7280' : '#4b5563',
                    callback: function (value: any) { return value + '%' }
                }
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[10px] text-blue-400 font-mono font-bold">ASSET A</label>
                    <select
                        className="terminal-input w-full"
                        value={tickerA}
                        onChange={(e) => setTickerA(e.target.value)}
                    >
                        {SEED_COMPANIES.map(c => <option key={c.ticker} value={c.ticker}>{c.name}</option>)}
                    </select>
                </div>

                <div className="flex items-center justify-center text-muted-foreground-app font-bold font-mono">VS</div>

                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[10px] text-emerald-400 font-mono font-bold">ASSET B</label>
                    <select
                        className="terminal-input w-full"
                        value={tickerB}
                        onChange={(e) => setTickerB(e.target.value)}
                    >
                        {SEED_COMPANIES.map(c => <option key={c.ticker} value={c.ticker}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="terminal-card p-4 min-h-[300px] flex items-center justify-center relative">
                {loading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                    </div>
                )}
                {dataA.length > 0 && dataB.length > 0 ? (
                    <Line options={options} data={chartData} />
                ) : (
                    <div className="text-muted-foreground-app font-mono text-sm">SELECT DATA TO COMPARE</div>
                )}
            </div>

            <p className="text-[10px] text-muted-foreground-app font-mono text-center">
                * {t('normalized_performance')}
            </p>
        </div>
    );
};
