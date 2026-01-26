import { NextRequest, NextResponse } from 'next/server';
import { getQuote } from '@/lib/yahoo';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ ticker: string }> }
) {
    const { ticker } = await params;

    if (!ticker) {
        return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    try {
        const data = await getQuote(ticker);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`Error fetching quote for ${ticker}:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
