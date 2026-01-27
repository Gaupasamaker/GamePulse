"use client";

import React, { useState, useEffect } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/providers/LanguageProvider';
import { supabase } from '@/lib/supabase';
import { analyzeSentiment, getFallbackImage } from '@/lib/newsHelpers';
import {
    Newspaper,
    ExternalLink,
    Clock,
    Tag,
    Loader2,
    TrendingUp,
    TrendingDown,
    Minus,
    Layout
} from 'lucide-react';

interface NewsCardProps {
    news: any;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
    const { t, language } = useLanguage();
    // Asegurar que datetime sea un número válido (ahora viene en millisegundos desde el backend)
    const timestamp = typeof news.datetime === 'number' ? news.datetime : Date.now();
    const date = new Date(timestamp);
    const dateLocale = language === 'es' ? es : enUS;

    // Validar que la fecha sea válida
    const isValidDate = !isNaN(date.getTime());

    // Categorización básica por palabras clave
    const getTag = (headline: string) => {
        const h = headline.toLowerCase();
        if (h.includes('earning') || h.includes('guidance')) return 'Earnings';
        if (h.includes('m&a') || h.includes('buyout') || h.includes('acquire')) return 'M&A';
        if (h.includes('layoff') || h.includes('job cut')) return 'Layoffs';
        if (h.includes('launch') || h.includes('release') || h.includes('product')) return 'Product';
        if (h.includes('lawsuit') || h.includes('court') || h.includes('regulation')) return 'Regulation';
        if (h.includes('partner') || h.includes('collaboration')) return 'Partnership';
        return 'General';
    };

    const tag = getTag(news.headline);
    const sentiment = analyzeSentiment(news.headline);
    const imageUrl = news.image || getFallbackImage(tag);

    const SentimentIcon = sentiment === 'bullish' ? TrendingUp : sentiment === 'bearish' ? TrendingDown : Minus;
    const sentimentColor = sentiment === 'bullish' ? 'text-green-500' : sentiment === 'bearish' ? 'text-red-500' : 'text-muted-foreground-app';
    const sentimentBg = sentiment === 'bullish' ? 'bg-green-500/10 border-green-500/20' : sentiment === 'bearish' ? 'bg-red-500/10 border-red-500/20' : 'bg-muted-app border-border-app';

    return (
        <div className="terminal-card p-4 flex gap-4 group hover:bg-secondary-app transition-colors">
            {/* Image Thumbnail */}
            <div className="hidden sm:block w-24 h-24 flex-shrink-0 rounded overflow-hidden border border-border-app/50 relative">
                <a href={news.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
                    <img
                        src={imageUrl}
                        alt={tag}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = getFallbackImage('General');
                        }}
                    />
                </a>
            </div>

            <div className="flex flex-col gap-2 flex-grow min-w-0">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                        {news.source === 'GamesIndustry.biz' ? (
                            <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 uppercase font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> GAMESINDUSTRY.BIZ
                            </span>
                        ) : news.source === 'Game Developer' ? (
                            <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 uppercase font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> GAME DEVELOPER
                            </span>
                        ) : (
                            <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase truncate max-w-[100px]">
                                {news.source}
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-muted-foreground-app whitespace-nowrap">
                            <Clock size={12} />
                            {isValidDate ? formatDistanceToNow(date, { addSuffix: true, locale: dateLocale }) : ''}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {/* Sentiment Badge */}
                        <div className={`badge ${sentimentBg} flex items-center gap-1`}>
                            <SentimentIcon size={12} className={sentimentColor} />
                            <span className={`uppercase font-bold text-[10px] ${sentimentColor}`}>{sentiment}</span>
                        </div>

                        <div className={`badge ${tag === 'Earnings' ? 'badge-blue' :
                            tag === 'M&A' ? 'badge-emerald' :
                                tag === 'Layoffs' ? 'badge-rose' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                            } border font-mono hidden md:block`}>
                            {tag}
                        </div>
                    </div>
                </div>

                <a href={news.url} target="_blank" rel="noopener noreferrer" className="block">
                    <h3 className="text-sm font-bold leading-tight group-hover:text-primary-app transition-colors line-clamp-2">
                        {news.headline}
                    </h3>
                </a>

                <p className="text-xs text-muted-foreground-app line-clamp-2 italic">
                    {news.summary}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border-app/50">
                    <div className="flex gap-1 overflow-hidden">
                        {news.related && news.related.split(',').slice(0, 3).map((ticker: string) => (
                            <span key={ticker} className="text-[9px] text-muted-foreground-app font-mono">#{ticker}</span>
                        ))}
                    </div>
                    <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 flex items-center gap-1 text-[10px] font-mono group/link whitespace-nowrap ml-2"
                    >
                        {t('read_more')} <ExternalLink size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
};


export const NewsFeed: React.FC<{ ticker?: string; query?: string; categoryLabel?: string }> = ({ ticker, query, categoryLabel }) => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'market' | 'portfolio'>('market');
    const [portfolioSymbols, setPortfolioSymbols] = useState<string[]>([]);
    const { t } = useLanguage();


    // Fetch user portfolio symbols
    useEffect(() => {
        const fetchPortfolio = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('portfolio_positions').select('symbol').eq('user_id', user.id);
                if (data && data.length > 0) {
                    const symbols = Array.from(new Set(data.map(p => p.symbol)));
                    setPortfolioSymbols(symbols);
                }
            }
        };
        fetchPortfolio();
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                let url = '/api/news';

                if (ticker) {
                    url = `/api/news/${ticker}`;
                } else if (activeTab === 'portfolio') {
                    if (portfolioSymbols.length === 0) {
                        setNews([]);
                        setLoading(false);
                        return;
                    }
                    // Limit to top 5 symbols to avoid overwhelming the API
                    url = `/api/news?q=${encodeURIComponent(portfolioSymbols.slice(0, 5).join(','))}`;
                } else {
                    // Market/General News
                    url = `/api/news?q=${encodeURIComponent(query || 'gaming')}`;
                }

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setNews(data.slice(0, 10)); // Top 10 news
                }
            } catch (err) {
                console.error('Error fetching news:', err);
            } finally {
                setLoading(false);
            }
        };

        // Debounce to prevent rapid refetching if symbols are loading
        const timeout = setTimeout(fetchNews, 100);
        return () => clearTimeout(timeout);
    }, [ticker, query, activeTab, portfolioSymbols]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 terminal-card min-h-[200px]">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
                <span className="font-mono text-[10px] text-gray-500">{t('loading_market')}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono font-bold text-gray-400 flex items-center gap-2">
                    <Newspaper size={16} className="text-blue-500" />
                    {ticker ? `${t('news_for')} ${ticker}` : categoryLabel || t('top_sector_news')}
                </h2>

                {/* Tabs - Only show if not in specific ticker view */}
                {!ticker && (
                    <div className="flex bg-secondary-app rounded-lg p-1 border border-border-app/30">
                        <button
                            onClick={() => setActiveTab('market')}
                            className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all ${activeTab === 'market'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                : 'text-muted-foreground-app hover:text-foreground-app'
                                }`}
                        >
                            {t('market_tab')}
                        </button>
                        <button
                            onClick={() => setActiveTab('portfolio')}
                            className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${activeTab === 'portfolio'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                : 'text-muted-foreground-app hover:text-foreground-app'
                                }`}
                        >
                            {t('portfolio_tab')}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {news.length > 0 ? (
                    news.map((item) => <NewsCard key={item.id} news={item} />)
                ) : (
                    <div className="text-center p-8 border border-dashed border-border-app rounded-md text-muted-foreground-app font-mono text-xs flex flex-col items-center gap-2 max-w-md mx-auto">
                        <Layout size={24} className="opacity-50" />
                        {activeTab === 'portfolio' && portfolioSymbols.length === 0 ? (
                            <span>
                                {t('no_portfolio_news_desc')}
                            </span>
                        ) : (
                            <span>{t('no_news')}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
