import yahooFinance from 'yahoo-finance2';

async function test() {
    console.log("Testing Yahoo Finance (Default Instance)...");
    try {
        // Suppress generic warnings if possible
        const result = await yahooFinance.search("gaming", { newsCount: 5 });
        console.log("Search Result keys:", Object.keys(result));

        if (result.news && result.news.length > 0) {
            console.log(`Found ${result.news.length} news items.`);
            console.log("First item:", result.news[0].title);
        } else {
            console.log("No news found.");
            console.log("Full result:", JSON.stringify(result, null, 2));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
