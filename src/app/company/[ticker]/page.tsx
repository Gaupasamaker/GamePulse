"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { SEED_COMPANIES } from '@/data/companies';
import { CompanyChart } from '@/components/CompanyChart';
import { NewsFeed } from '@/components/NewsFeed';
import { useQuotes } from '@/hooks/useQuotes';
import { ArrowLeft, ChevronRight, Globe, Tag, Info, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLanguage } from '@/providers/LanguageProvider';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function CompanyPage() {
    const { ticker } = useParams<{ ticker: string }>();
    const company = SEED_COMPANIES.find(c => c.ticker === ticker);
    const { quotes, loading: quotesLoading } = useQuotes(ticker ? [ticker] : []);
    const quote = ticker ? quotes[ticker] : null;
    const { t } = useLanguage();

    if (!company) {
        return (
            <div className="p-12 text-center flex flex-col items-center gap-4">
                <AlertCircle size={48} className="text-rose-500" />
                <h1 className="text-xl font-mono text-foreground-app">{t('not_found')}</h1>
                <Link href="/" className="terminal-btn terminal-btn-primary">
                    <ArrowLeft size={16} /> {t('return_dashboard')}
                </Link>
            </div>
        );
    }

    const isUp = quote && quote.changePercent > 0;
    const isDown = quote && quote.changePercent < 0;

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground-app mb-2">
                <Link href="/" className="hover:text-blue-500">{t('dashboard')}</Link>
                <ChevronRight size={10} />
                <span className="text-muted-foreground-app/80">{company.ticker}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info & Chart */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-2 border-emerald-500 pl-4 py-2">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold font-mono text-foreground-app tracking-tighter">
                                    {company.name}
                                </h1>
                                <span className="bg-secondary-app opacity-50 px-2 py-1 rounded text-xs font-mono">
                                    {company.exchange}:{company.ticker}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground-app font-mono uppercase">
                                    <Globe size={12} /> {company.region}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground-app font-mono uppercase">
                                    <Tag size={12} /> {company.category}
                                </span>
                            </div>
                        </div>

                        <div className="text-right">
                            {quote ? (
                                <div className="flex flex-col">
                                    <span className="text-4xl font-mono font-bold text-foreground-app leading-none">
                                        ${typeof quote.price === 'number' ? quote.price.toFixed(2) : '--'}
                                    </span>
                                    <div className={cn(
                                        "text-sm font-mono font-bold mt-1",
                                        isUp ? "text-emerald-400" : isDown ? "text-rose-500" : "text-muted-foreground-app"
                                    )}>
                                        {isUp ? '+' : ''}{typeof quote.change === 'number' ? quote.change.toFixed(2) : '--'} ({typeof quote.changePercent === 'number' ? quote.changePercent.toFixed(2) : '--'}%)
                                    </div>
                                </div>
                            ) : (
                                <div className="h-10 w-24 bg-muted-app animate-pulse rounded"></div>
                            )}
                        </div>
                    </section>

                    <div className="terminal-card p-6">
                        <CompanyChart ticker={company.ticker} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="terminal-card p-4">
                            <h3 className="text-[10px] font-mono font-bold text-muted-foreground-app flex items-center gap-2 mb-3">
                                <Info size={14} className="text-blue-500" />
                                {t('about_company')}
                            </h3>
                            <p className="text-xs text-muted-foreground-app leading-relaxed font-mono">
                                {company.name} es un {company.category.toLowerCase()} líder centrado en {company.region}.
                                Sus activos clave incluyen: {company.keywords.join(", ")}.
                                Actualmente monitoreado por su impacto sistémico en la industria global de videojuegos.
                            </p>
                        </div>

                        <div className="terminal-card p-4">
                            <h3 className="text-[10px] font-mono font-bold text-muted-foreground-app flex items-center gap-2 mb-3">
                                <Tag size={14} className="text-blue-500" />
                                {t('business_keywords')}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {company.keywords.map(kw => (
                                    <span key={kw} className="bg-blue-500/5 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-[10px] font-mono">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Company News & Alerts */}
                <div className="flex flex-col gap-6">
                    <div className="terminal-card p-4 bg-primary-app/5 border-primary-app/20">
                        <h3 className="text-[10px] font-mono font-bold text-primary-app flex items-center gap-2 mb-3">
                            <AlertCircle size={14} />
                            {t('system_alerts')}
                        </h3>
                        <div className="text-[10px] text-muted-foreground-app font-mono mb-4">
                            Monitoriza cambios de precio y palabras clave.
                        </div>
                        <button className="w-full py-2 border border-primary-app/40 text-primary-app font-mono text-[10px] rounded hover:bg-primary-app/10 transition-colors uppercase">
                            {t('configure_alert')}
                        </button>
                    </div>

                    <NewsFeed ticker={company.ticker} />
                </div>
            </div>
        </div>
    );
}
