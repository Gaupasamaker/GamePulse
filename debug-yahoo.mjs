import yahooFinance from 'yahoo-finance2';

async function testVideoGameNews() {
    console.log("Testing Yahoo Finance Search...");
    try {
        const query = "video games";
        console.log(`Querying: "${query}"`);
        const result = await yahooFinance.search(query, { newsCount: 5 });
        console.log("Result keys:", Object.keys(result));

        if (result.news) {
            console.log(`News found: ${result.news.length}`);
            if (result.news.length > 0) {
                console.log("Sample news item:", JSON.stringify(result.news[0], null, 2));
            }
        } else {
            console.log("No 'news' field in result");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

testVideoGameNews();
