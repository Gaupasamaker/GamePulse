import YahooFinance from 'yahoo-finance2';

const yahoo = new YahooFinance();

async function test() {
    console.log("Testing Specific Query...");
    try {
        const query = "gaming industry video games"; // La query por defecto
        console.log(`Searching for: "${query}"`);
        const result = await yahoo.search(query, { newsCount: 5 });

        console.log("Result News Count:", result.news ? result.news.length : 0);

        if (result.news && result.news.length > 0) {
            const first = result.news[0];
            console.log("First news title:", first.title);
            console.log("Date type:", typeof first.providerPublishTime);
            console.log("Date value:", first.providerPublishTime);
            if (first.providerPublishTime instanceof Date) {
                console.log("It IS a Date object");
            } else {
                console.log("It is NOT a Date object");
            }
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
