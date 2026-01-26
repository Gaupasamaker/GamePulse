"use client";

import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Loader2, TrendingUp, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

interface CompanyChartProps {
    ticker: string;
}

export const CompanyChart: React.FC<CompanyChartProps> = ({ ticker }) => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [range, setRange] = useState('1M');

    // Pro Features State
    const [showVolume, setShowVolume] = useState(false);
    const [showSMA, setShowSMA] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/history/${ticker}?range=${range}`);
                if (!res.ok) throw new Error('Failed to fetch history');

                const json = await res.json();

                // Formateo inteligente según rango
                const formatDate = (dateStr: string) => {
                    const d = new Date(dateStr);
                    if (range === '1D' || range === '5D') {
                        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                };

                // Cálculo SMA Simple (20 periods)
                const calculateSMA = (data: any[], window: number) => {
                    let sma = [];
                    for (let i = 0; i < data.length; i++) {
                        if (i < window - 1) {
                            sma.push(null); // No hay suficientes datos para los primeros puntos
                            continue;
                        }
                        const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
                        sma.push(sum / window);
                    }
                    return sma;
                };

                const prices = json.map((d: any) => d.close);
                const volumes = json.map((d: any) => d.volume);
                const smaData = calculateSMA(prices, 20);

                const datasets: any[] = [
                    {
                        type: 'line' as const,
                        label: ticker,
                        data: prices,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        tension: 0.4,
                        yAxisID: 'y',
                        fill: true,
                    }
                ];

                if (showSMA) {
                    datasets.push({
                        type: 'line' as const,
                        label: 'SMA 20',
                        data: smaData,
                        borderColor: '#fbbf24', // Amber
                        borderWidth: 1,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        tension: 0.4,
                        yAxisID: 'y',
                    });
                }

                if (showVolume) {
                    datasets.push({
                        type: 'bar' as const,
                        label: 'Volume',
                        data: volumes,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        yAxisID: 'y1',
                        barThickness: 'flex',
                        categoryPercentage: 1.0,
                        barPercentage: 0.8,
                    });
                }

                setData({
                    labels: json.map((d: any) => formatDate(d.date)),
                    datasets
                });
            } catch (err) {
                console.error(err);
                // Fallback visual vacío o mensaje de error
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ticker, range, showVolume, showSMA]);

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#0a0a0b',
                titleFont: { family: 'JetBrains Mono' },
                bodyFont: { family: 'JetBrains Mono' },
                borderColor: '#27272a',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#71717a', font: { size: 10, family: 'JetBrains Mono' } },
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                grid: { color: 'rgba(39, 39, 42, 0.5)' },
                ticks: { color: '#71717a', font: { size: 10, family: 'JetBrains Mono' } },
            },
            y1: {
                type: 'linear' as const,
                display: false, // Ocultar eje de volumen pero usarlo para escalar
                position: 'right' as const,
                grid: { display: false },
                min: 0, // Asegurar que volumen empieza en 0
            },
        },
        interaction: {
            intersect: false,
        },
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Range Selector */}
                <div className="flex items-center gap-1 bg-black/20 p-1 rounded border border-border-app">
                    {['1D', '5D', '1M', '6M', '1Y'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-3 py-1 rounded font-mono text-[10px] transition-all ${range === r ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {/* Pro Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSMA(!showSMA)}
                        className={`flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-mono transition-colors ${showSMA ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'border-border-app text-gray-500 hover:text-white'
                            }`}
                    >
                        <TrendingUp size={12} /> {t('show_sma')}
                    </button>
                    <button
                        onClick={() => setShowVolume(!showVolume)}
                        className={`flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-mono transition-colors ${showVolume ? 'bg-purple-500/10 border-purple-500 text-purple-500' : 'border-border-app text-gray-500 hover:text-white'
                            }`}
                    >
                        <BarChart3 size={12} /> {t('show_volume')}
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg border border-border-app border-dashed">
                        <Loader2 className="animate-spin text-blue-500" size={24} />
                    </div>
                ) : data ? (
                    <Line options={options} data={data} />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 rounded-lg border border-border-app border-dashed text-gray-500 font-mono text-xs gap-2">
                        <span className="text-xl">📉</span>
                        <span>DATOS NO DISPONIBLES</span>
                        <span className="text-[10px] opacity-70 max-w-[200px] text-center">
                            El mercado podría estar cerrado o no hay datos para este rango ({range}).
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
