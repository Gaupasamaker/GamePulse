import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalData } from '@/lib/yahoo';

export async function GET(request: NextRequest, { params }: { params: Promise<{ ticker: string }> }) {
    const { ticker } = await params;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '6M';

    let interval: '1d' | '15m' | '60m' = '1d';

    const fromDate = new Date();
    switch (range) {
        // Yahoo Free Intraday limitations:
        // 1D -> 5m, 15m (up to 30-60 days usually, but best for 'today'). 
        // 5D -> 60m (1h) is safer.
        case '1D':
            fromDate.setDate(fromDate.getDate() - 2); // Pillamos 2 días para asegurar datos si es finde o festivo
            interval = '15m';
            break;
        case '5D':
            fromDate.setDate(fromDate.getDate() - 5);
            interval = '60m';
            break;
        case '1M': fromDate.setMonth(fromDate.getMonth() - 1); interval = '1d'; break;
        case '6M': fromDate.setMonth(fromDate.getMonth() - 6); interval = '1d'; break;
        case '1Y': fromDate.setFullYear(fromDate.getFullYear() - 1); interval = '1d'; break;
        default: fromDate.setMonth(fromDate.getMonth() - 6); interval = '1d';
    }

    try {
        const data = await getHistoricalData(ticker, fromDate, interval);
        // Si pedimos 1D, filtramos solo los datos de hoy/ayer para que el gráfico no se vea de 2 días
        if (range === '1D') {
            // Lógica simple: quedarse con las últimas 24h reales
            const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
            const filtered = data.filter((d: { date: string }) => new Date(d.date).getTime() > oneDayAgo);
            return NextResponse.json(filtered.length > 0 ? filtered : data); // Si filtrado deja vacío, devolvemos todo por si acaso
        }
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
