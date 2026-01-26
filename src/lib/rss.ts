import Parser from 'rss-parser';

const parser = new Parser();

export interface RSSItem {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    contentSnippet?: string;
    source: string;
}

const FEEDS = [
    { source: 'GamesIndustry.biz', url: 'https://www.gamesindustry.biz/feed/news' },
    { source: 'Game Developer', url: 'https://www.gamedeveloper.com/rss.xml' },
    { source: 'VGC', url: 'https://www.videogameschronicle.com/category/news/feed/' },
    { source: 'Eurogamer', url: 'https://www.eurogamer.net/feed/news' },
    { source: 'Kotaku', url: 'https://kotaku.com/rss' },
    { source: 'Polygon', url: 'https://www.polygon.com/rss/index.xml' }
];

export async function getRSSNews(): Promise<RSSItem[]> {
    let allNews: RSSItem[] = [];
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const promises = FEEDS.map(async (feed) => {
        try {
            console.log(`Fetching RSS: ${feed.url}`);
            // Timeout para evitar que una fuente lenta bloquee todo
            const feedData = await Promise.race([
                parser.parseURL(feed.url),
                new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);

            return feedData.items.map((item: any) => {
                // Validación robusta de fecha
                const pubDateStr = item.pubDate || item.isoDate || new Date().toISOString();
                const pubDate = new Date(pubDateStr);

                // Si la fecha es inválida, usamos 'ahora' o descartamos (aquí usamos validación en filtro después)
                if (isNaN(pubDate.getTime())) {
                    return null;
                }

                return {
                    id: item.guid || item.link || Math.random().toString(36),
                    title: item.title || 'No Title',
                    link: item.link || '',
                    pubDate: pubDate.toISOString(),
                    contentSnippet: item.contentSnippet || item.content || '',
                    source: feed.source
                };
            }).filter((item: any) => item !== null); // Eliminar noticias con fechas rotas
        } catch (error) {
            console.error(`Error fetching RSS from ${feed.source}:`, error);
            return [];
        }
    });

    const results = await Promise.all(promises);

    results.forEach(items => {
        allNews = [...allNews, ...items];
    });

    // Filtrar noticias muy viejas (> 30 días)
    allNews = allNews.filter(item => {
        const itemTime = new Date(item.pubDate).getTime();
        return (now - itemTime) < THIRTY_DAYS_MS;
    });

    // Ordenar: más reciente primero
    return allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}
