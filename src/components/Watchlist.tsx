"use client";

import React from 'react';
import { SEED_COMPANIES } from '@/data/companies';
import { useQuotes } from '@/hooks/useQuotes';
import { ArrowUpRight, ArrowDownRight, Minus, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLanguage } from '@/providers/LanguageProvider';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Watchlist: React.FC = () => {
    const tickers = SEED_COMPANIES.map(c => c.ticker);
    const { quotes, loading, error, lastUpdated } = useQuotes(tickers);
    const { t } = useLanguage();

    if (loading && Object.keys(quotes).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 terminal-card min-h-[400px]">
                <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
                <span className="font-mono text-sm text-muted-foreground-app">{t('loading_market')}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono font-bold text-muted-foreground-app flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    {t('watchlist')}
                </h2>
                {lastUpdated && (
                    <span className="text-[10px] font-mono text-muted-foreground-app">
                        {t('last_refresh')} {lastUpdated.toLocaleTimeString()}
                    </span>
                )}
            </div>

            <div className="terminal-card overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                    <thead>
                        <tr className="border-b border-border-app bg-secondary-app/50">
                            <th className="px-4 py-3 font-semibold text-muted-foreground-app">{t('ticker')}</th>
                            <th className="px-4 py-3 font-semibold text-gray-500">COMPANY</th>
                            <th className="px-4 py-3 font-semibold text-right text-muted-foreground-app">{t('price')}</th>
                            <th className="px-4 py-3 font-semibold text-right text-muted-foreground-app">{t('change_1d')}</th>
                            <th className="px-4 py-3 font-semibold hidden md:table-cell text-muted-foreground-app">{t('category')}</th>
                            <th className="px-4 py-3 font-semibold text-center text-muted-foreground-app">{t('action')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-app/50">
                        {SEED_COMPANIES.map((company) => {
                            const quote = quotes[company.ticker];
                            const isUp = quote && quote.changePercent > 0;
                            const isDown = quote && quote.changePercent < 0;

                            return (
                                <tr key={company.id} className="hover:bg-blue-500/5 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-foreground-app font-bold">{company.name}</span>
                                            <span className="text-[10px] text-muted-foreground-app uppercase">{company.region}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="bg-secondary-app px-1.5 py-0.5 rounded text-[10px] text-muted-foreground-app">
                                            {company.ticker}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {quote && typeof quote.price === 'number' ? (
                                            <span className="text-foreground-app font-bold">${quote.price.toFixed(2)}</span>
                                        ) : (
                                            <span className="text-gray-600">--</span>
                                        )}
                                    </td>
                                    <td className={cn(
                                        "px-4 py-3 text-right font-bold",
                                        isUp ? "text-emerald-400" : isDown ? "text-rose-500" : "text-muted-foreground-app"
                                    )}>
                                        {quote ? (
                                            <div className="flex items-center justify-end gap-1">
                                                {isUp ? <ArrowUpRight size={14} /> : isDown ? <ArrowDownRight size={14} /> : <Minus size={14} />}
                                                {typeof quote.changePercent === 'number' ? quote.changePercent.toFixed(2) : '0.00'}%
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground-app">--</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className={cn(
                                            "badge",
                                            company.category === 'Platform' ? "badge-blue" : "badge-emerald"
                                        )}>
                                            {company.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Link
                                            href={`/company/${company.ticker}`}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border-app hover:border-blue-500/50 hover:bg-blue-500/10 text-muted-foreground-app hover:text-blue-500 transition-all"
                                        >
                                            <ArrowRight size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {error && <div className="text-rose-500 text-[10px] font-mono mt-1 text-center">{error}</div>}
        </div>
    );
};
