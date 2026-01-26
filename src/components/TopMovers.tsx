"use client";

import React from 'react';
import { SEED_COMPANIES } from '@/data/companies';
import { useQuotes } from '@/hooks/useQuotes';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLanguage } from '@/providers/LanguageProvider';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const TopMovers: React.FC = () => {
    const tickers = SEED_COMPANIES.map(c => c.ticker);
    const { quotes, loading } = useQuotes(tickers);
    const { t } = useLanguage();

    if (loading && Object.keys(quotes).length === 0) return null;

    const sortedQuotes = Object.entries(quotes)
        .sort(([, a], [, b]) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        .slice(0, 5);

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-sm font-mono font-bold text-gray-400 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" />
                {t('top_movers')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {sortedQuotes.map(([ticker, quote]) => {
                    const company = SEED_COMPANIES.find(c => c.ticker === ticker);
                    const isUp = quote.changePercent > 0;

                    return (
                        <Link
                            key={ticker}
                            href={`/company/${ticker}`}
                            className="terminal-card p-3 flex flex-col gap-1 hover:border-blue-500/50 group"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-mono text-gray-500">{ticker}</span>
                                {isUp ? (
                                    <ArrowUpRight size={14} className="text-emerald-400" />
                                ) : (
                                    <ArrowDownRight size={14} className="text-rose-500" />
                                )}
                            </div>
                            <span className="text-xs font-bold truncate group-hover:text-blue-400 transition-colors">
                                {company?.name || ticker}
                            </span>
                            <div className={cn(
                                "text-sm font-mono font-bold mt-1",
                                isUp ? "text-emerald-400" : "text-rose-500"
                            )}>
                                {isUp ? '+' : ''}{typeof quote.changePercent === 'number' ? quote.changePercent.toFixed(2) : '0.00'}%
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
