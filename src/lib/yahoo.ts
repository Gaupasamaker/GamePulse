import YahooFinance from 'yahoo-finance2';
// Usar instanciación explícita para evitar problemas de compatibilidad en ciertas versiones/entornos
const yahooFinance = new YahooFinance();

// Interfaz unificada para la app (independiente de la fuente)
export interface Quote {
    price: number;
    change: number;
    changePercent: number;
    lastUpdated: number;
}

export interface News {
    id: string;
    headline: string;
    summary: string;
    source: string;
    url: string;
    datetime: number;
    category: string;
    related: string;
}

// Cache simple en memoria
const cache: Record<string, { data: any; timestamp: number }> = {};

async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>, ttl: number): Promise<T> {
    const now = Date.now();
    if (cache[key] && now - cache[key].timestamp < ttl) {
        return cache[key].data as T;
    }
    const data = await fetcher();
    cache[key] = { data, timestamp: now };
    return data;
}

export async function getQuote(ticker: string): Promise<Quote> {
    // Yahoo Finance devuelve floats con mucha precisión, normalizamos aquí si es necesario
    return fetchWithCache(`quote:${ticker}`, async () => {
        try {
            const result = await yahooFinance.quote(ticker) as any;
            return {
                price: result.regularMarketPrice || 0,
                change: result.regularMarketChange || 0,
                changePercent: result.regularMarketChangePercent || 0,
                lastUpdated: (new Date(result.regularMarketTime)).getTime() || Date.now(),
            };
        } catch (e) {
            console.error(`Error fetching quote for ${ticker}:`, e);
            // Fallback seguro para no romper UI
            return { price: 0, change: 0, changePercent: 0, lastUpdated: Date.now() };
        }
    }, 30 * 1000); // 30s cache
}

export async function getNews(query: string = 'gaming'): Promise<News[]> {
    return fetchWithCache(`news:${query}`, async () => {
        try {
            const result = await yahooFinance.search(query, { newsCount: 10 }) as any;
            // Mapeamos las noticias de Yahoo a nuestra interfaz común
            if (!result.news || result.news.length === 0) return [];

            return result.news.map((item: any) => ({
                id: item.uuid || item.link || Math.random().toString(36),
                headline: item.title,
                summary: '', // Yahoo search news a veces no trae summary limpio, usamos título como fallback visual en UI
                source: item.publisher,
                url: item.link,
                image: item.thumbnail?.resolutions?.[0]?.url || null,
                datetime: item.providerPublishTime ? new Date(item.providerPublishTime).getTime() : Date.now(),
                category: 'General',
                related: item.relatedTickers?.join(',') || ''
            }));
        } catch (e) {
            console.error('Error fetching news:', e);
            return [];
        }
    }, 5 * 60 * 1000); // 5 min cache
}


export async function getHistoricalData(ticker: string, fromDate: Date, interval: '1d' | '1wk' | '1mo' | '15m' | '60m' = '1d'): Promise<{ date: string; close: number; volume: number }[]> {
    return fetchWithCache(`history:${ticker}:${fromDate.getTime()}:${interval}`, async () => {
        try {
            const queryOptions = {
                period1: fromDate.toISOString(), // ISO completo para soportar hora en intradía
                period2: new Date().toISOString(),
                interval: interval
            };
            console.log(`[History Debug] Fetching ${ticker} (int: ${interval}) from ${fromDate.toISOString()}`);
            const result = await yahooFinance.historical(ticker, queryOptions as any);

            return result.map((r: any) => ({
                date: r.date.toISOString(),
                close: r.close,
                volume: r.volume // Añadimos volumen para gráficos avanzados
            })).filter(r => r.close !== null && r.close !== undefined); // Filtrar nulls
        } catch (e) {
            console.error(`Error fetching history for ${ticker}:`, e);
            // @ts-ignore
            if (e.Errors) console.error('Yahoo Errors:', JSON.stringify(e.Errors, null, 2));
            return [];
        }
    }, 15 * 60 * 1000); // 15 min caché (más corto para intradía)
}
