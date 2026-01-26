import { NextRequest, NextResponse } from 'next/server';
import { getNews } from '@/lib/yahoo';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || 'gaming industry video games';

        // Si la query es muy genérica, añadimos términos para mejorar relevancia
        // query más simple suele dar mejores resultados en Yahoo search
        const finalQuery = query;

        const data = await getNews(finalQuery);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`Error fetching general news:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
