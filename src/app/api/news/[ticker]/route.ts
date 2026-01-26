import { NextRequest, NextResponse } from 'next/server';
import { getNews } from '@/lib/yahoo';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ ticker: string }> }
) {
    const { ticker } = await params;

    if (!ticker) {
        return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    try {
        const data = await getNews(ticker);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`Error fetching company news for ${ticker}:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
