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
            // Yahoo Intraday (15m) permite hasta 60 días. Pedimos 7 días para asegurar que pillamos la última sesión válida
            // (ej. si es Lunes o festivo). Luego filtramos.
            fromDate.setDate(fromDate.getDate() - 7);
            interval = '15m';
            break;
        case '5D':
            fromDate.setDate(fromDate.getDate() - 14); // Buffer seguro
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
        // Si pedimos 1D, filtramos inteligente: Queremos la URTIMA sesión de mercado disponible.
        if (range === '1D' && data.length > 0) {
            // Encontrar la fecha del último dato
            const lastDate = new Date(data[data.length - 1].date);
            // Definir "mismo día" que el último dato
            const startOfLastSession = new Date(lastDate);
            startOfLastSession.setHours(0, 0, 0, 0); // Inicio del día de la última sesión

            // Devolver solo los datos que coincidan con el día de la última sesión registrada
            const filtered = data.filter((d: { date: string }) => new Date(d.date) >= startOfLastSession);
            return NextResponse.json(filtered);
        }
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
