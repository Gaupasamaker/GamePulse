"use client";

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Gauge } from 'lucide-react';
import { analyzeSentiment } from '@/lib/newsHelpers';

interface SentimentMeterProps {
    news: any[];
}

export const SentimentMeter: React.FC<SentimentMeterProps> = ({ news }) => {

    const sentimentScore = useMemo(() => {
        if (!news || news.length === 0) return 50; // Neutral default

        let score = 50;
        let bullishCount = 0;
        let bearishCount = 0;

        news.forEach(item => {
            const sentiment = analyzeSentiment(item.headline);
            if (sentiment === 'bullish') {
                score += 5;
                bullishCount++;
            } else if (sentiment === 'bearish') {
                score -= 5;
                bearishCount++;
            }
        });

        // Clamp between 0 and 100
        return Math.max(0, Math.min(100, score));
    }, [news]);

    const getSentimentLabel = (score: number) => {
        if (score >= 80) return { label: 'EUPHORIA', color: 'text-emerald-400', bg: 'bg-emerald-500' };
        if (score >= 60) return { label: 'GREED', color: 'text-emerald-300', bg: 'bg-emerald-400' };
        if (score <= 20) return { label: 'EXTREME FEAR', color: 'text-rose-500', bg: 'bg-rose-600' };
        if (score <= 40) return { label: 'FEAR', color: 'text-rose-400', bg: 'bg-rose-500' };
        return { label: 'NEUTRAL', color: 'text-gray-400', bg: 'bg-gray-500' };
    };

    const { label, color, bg } = getSentimentLabel(sentimentScore);

    return (
        <div className="terminal-card p-4 mb-4 bg-gradient-to-r from-secondary-app/50 to-background-app flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className={`p-3 rounded-full ${bg}/10 border border-${bg}/20 flex items-center justify-center`}>
                <Gauge size={24} className={color} />
            </div>

            <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xs font-mono text-muted-foreground-app uppercase mb-1">Market Sentiment Analysis</h3>
                <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <span className={`text-2xl font-black font-mono tracking-tighter ${color}`}>
                        {label}
                    </span>
                    <span className="text-sm font-mono text-muted-foreground-app">
                        ({sentimentScore}/100)
                    </span>
                </div>
            </div>

            {/* Meter Visual */}
            <div className="w-full sm:w-48 h-2 bg-secondary-app rounded-full overflow-hidden relative">
                {/* Gradient Bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-yellow-500 to-emerald-500 opacity-30"></div>

                {/* Pointer/Fill */}
                <div
                    className="h-full bg-foreground-app w-1 absolute top-0 transition-all duration-1000 ease-out shadow-[0_0_10px_white]"
                    style={{ left: `${sentimentScore}%` }}
                ></div>
            </div>
        </div>
    );
};
