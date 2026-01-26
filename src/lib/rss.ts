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
    { source: 'Game Developer', url: 'https://www.gamedeveloper.com/rss.xml' }
];

export async function getRSSNews(): Promise<RSSItem[]> {
    let allNews: RSSItem[] = [];

    const promises = FEEDS.map(async (feed) => {
        try {
            console.log(`Fetching RSS: ${feed.url}`);
            const feedData = await parser.parseURL(feed.url);

            return feedData.items.map(item => ({
                id: item.guid || item.link || Math.random().toString(36),
                title: item.title || 'No Title',
                link: item.link || '',
                pubDate: item.pubDate || new Date().toISOString(),
                contentSnippet: item.contentSnippet || '',
                source: feed.source
            }));
        } catch (error) {
            console.error(`Error fetching RSS from ${feed.source}:`, error);
            return [];
        }
    });

    const results = await Promise.all(promises);

    results.forEach(items => {
        allNews = [...allNews, ...items];
    });

    // Ordenar por fecha (más reciente primero)
    return allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}
