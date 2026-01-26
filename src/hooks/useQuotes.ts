"use client";

import { useState, useEffect } from 'react';

export interface QuoteData {
    price: number;
    change: number;
    changePercent: number;
    lastUpdated: number;
}

export function useQuotes(tickers: string[]) {
    const [quotes, setQuotes] = useState<Record<string, QuoteData>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchQuotes = async () => {
        try {
            const results: Record<string, QuoteData> = {};
            await Promise.all(
                tickers.map(async (ticker) => {
                    const res = await fetch(`/api/quote/${ticker}`);
                    if (res.ok) {
                        results[ticker] = await res.json();
                    }
                })
            );
            setQuotes((prev) => ({ ...prev, ...results }));
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            console.error('Error fetching quotes:', err);
            setError('Failed to refresh data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
        const interval = setInterval(fetchQuotes, 60000); // Poll every 60s
        return () => clearInterval(interval);
    }, [tickers.join(',')]);

    return { quotes, loading, error, lastUpdated, refresh: fetchQuotes };
}
