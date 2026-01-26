import { NextRequest, NextResponse } from 'next/server';
import { getNews } from '@/lib/yahoo';
import { getRSSNews } from '@/lib/rss';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || 'gaming';

        // Si la búsqueda es "gaming" (General), mezclamos RSS de calidad
        let rssNews: any[] = [];
        if (query === 'gaming' || query === 'gaming industry') {
            rssNews = await getRSSNews();
        }

        const yahooNews = await getNews(query);

        // Adaptar RSS al formato de la app
        const formattedRSS = rssNews.map(item => ({
            id: item.id,
            headline: item.title,
            summary: item.contentSnippet?.slice(0, 150) + '...',
            source: item.source, // 'GamesIndustry.biz' o 'Game Developer'
            url: item.link,
            datetime: new Date(item.pubDate).getTime(),
            category: 'Industry',
            related: ''
        }));

        // Combinar y ordenar: Prioridad a RSS (más calidad) pero mezclado
        // Estrategia: Ponemos 3 de RSS primero, luego mezclados
        const combined = [...formattedRSS, ...yahooNews].sort((a, b) => b.datetime - a.datetime);

        return NextResponse.json(combined);
    } catch (error: any) {
        console.error(`Error fetching general news:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
