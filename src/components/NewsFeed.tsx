"use client";

import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, Tag, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/providers/LanguageProvider';

interface NewsCardProps {
    news: any;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
    const { t, language } = useLanguage();
    // Asegurar que datetime sea un número válido
    const timestamp = typeof news.datetime === 'number' ? news.datetime : Date.now() / 1000;
    const date = new Date(timestamp * 1000);
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

    return (
        <div className="terminal-card p-4 flex flex-col gap-3 group">
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
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                            {news.source}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-500">
                        <Clock size={12} />
                        {isValidDate ? formatDistanceToNow(date, { addSuffix: true, locale: dateLocale }) : ''}
                    </span>
                </div>
                <div className={`badge ${tag === 'Earnings' ? 'badge-blue' :
                    tag === 'M&A' ? 'badge-emerald' :
                        tag === 'Layoffs' ? 'badge-rose' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                    } border font-mono`}>
                    {tag}
                </div>
            </div>

            <h3 className="text-sm font-bold leading-tight group-hover:text-blue-400 transition-colors">
                {news.headline}
            </h3>

            <p className="text-xs text-gray-500 line-clamp-2 italic">
                {news.summary}
            </p>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border-app/50">
                <div className="flex gap-1">
                    {news.related && news.related.split(',').slice(0, 3).map((ticker: string) => (
                        <span key={ticker} className="text-[9px] text-gray-400 font-mono">#{ticker}</span>
                    ))}
                </div>
                <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400 flex items-center gap-1 text-[10px] font-mono group/link"
                >
                    {t('read_more')} <ExternalLink size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
            </div>
        </div>
    );
};

export const NewsFeed: React.FC<{ ticker?: string; query?: string; categoryLabel?: string }> = ({ ticker, query, categoryLabel }) => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                let url = '/api/news';

                if (ticker) {
                    url = `/api/news/${ticker}`;
                } else if (query) {
                    url = `/api/news?q=${encodeURIComponent(query)}`;
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
        fetchNews();
    }, [ticker, query]);

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
            <h2 className="text-sm font-mono font-bold text-gray-400 flex items-center gap-2">
                <Newspaper size={16} className="text-blue-500" />
                {ticker ? `${t('news_for')} ${ticker}` : categoryLabel || t('top_sector_news')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {news.length > 0 ? (
                    news.map((item) => <NewsCard key={item.id} news={item} />)
                ) : (
                    <div className="text-center p-8 border border-dashed border-border-app rounded-md text-gray-500 font-mono text-xs">
                        {t('no_news')}
                    </div>
                )}
            </div>
        </div>
    );
};
