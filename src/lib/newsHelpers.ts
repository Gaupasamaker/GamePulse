import { Newspaper, TrendingUp, TrendingDown, Gamepad2, Cpu, Briefcase } from 'lucide-react';

export type Sentiment = 'bullish' | 'bearish' | 'neutral';

const BULLISH_KEYWORDS = ['soars', 'jumps', 'surges', 'record', 'high', 'profit', 'beat', 'growth', 'up', 'buy', 'strong', 'gains', 'rally'];
const BEARISH_KEYWORDS = ['plunges', 'drops', 'falls', 'low', 'loss', 'miss', 'weak', 'down', 'sell', 'crash', 'slump', 'cuts'];

export function analyzeSentiment(title: string): Sentiment {
    const lowerTitle = title.toLowerCase();

    // Check for Bullish
    if (BULLISH_KEYWORDS.some(k => lowerTitle.includes(k))) return 'bullish';

    // Check for Bearish
    if (BEARISH_KEYWORDS.some(k => lowerTitle.includes(k))) return 'bearish';

    return 'neutral';
}

export function getCategoryIcon(category: string) {
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('tech') || lowerCat.includes('ai')) return Cpu;
    if (lowerCat.includes('finance') || lowerCat.includes('market')) return Briefcase;
    if (lowerCat.includes('game') || lowerCat.includes('console')) return Gamepad2;
    return Newspaper;
}

// Map categories or keywords to placeholder images if Yahoo image is missing
// In a real app, these would be local assets or reliable CDN links
export function getFallbackImage(category: string): string {
    // Using generic tech/finance placeholders from Unsplash source
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('tech')) return "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";
    if (lowerCat.includes('game')) return "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80";
    if (lowerCat.includes('financ')) return "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&w=800&q=80";

    return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"; // Generic News
}
