"use client";

import React from 'react';
import { NewsFeed } from '@/components/NewsFeed';
import { Newspaper } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

const CATEGORIES = [
    { id: 'general', labelKey: 'General', query: 'gaming industry video games' },
    { id: 'financial', labelKey: 'Financial', query: 'gaming industry earnings revenue stock' },
    { id: 'ma', labelKey: 'M&A', query: 'gaming industry acquisition merger buyout' },
    { id: 'tech', labelKey: 'Tech', query: 'gaming technology hardware console gpu' },
];

export default function NewsPage() {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = React.useState(CATEGORIES[0]);

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8">
            <section className="border-l-2 border-blue-600 pl-4 py-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-white tracking-tighter flex items-center gap-2">
                        <Newspaper className="text-blue-500" />
                        {t('sector_news')}
                    </h1>
                    <p className="text-sm text-gray-500 font-mono mt-1">
                        Últimas noticias y análisis del mercado global de videojuegos.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded text-[10px] font-mono border transition-colors ${selectedCategory.id === cat.id
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-black/50 border-gray-700 text-gray-400 hover:border-gray-500'
                                }`}
                        >
                            {cat.labelKey}
                        </button>
                    ))}
                </div>
            </section>

            <NewsFeed query={selectedCategory.query} categoryLabel={selectedCategory.labelKey} />
        </div>
    );
}
