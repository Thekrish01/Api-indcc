const puppeteer = require("puppeteer");

async function fetchCardDetails() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36");
    await page.goto("https://www.coolgenerator.com/credit-card-generator-india", { waitUntil: "networkidle2" });

    // Extract card details
    const cardData = await page.evaluate(() => {
        const firstCard = document.querySelector(".list-unstyled.content-list li");
        if (!firstCard) return { error: "No card details found." };

        return {
            "Card Brand": firstCard.querySelector("p.grey span")?.innerText.trim() || "N/A",
            "Credit Card No": firstCard.querySelector("p.font-18 b span")?.innerText.trim() || "N/A",
            "Expiry": firstCard.querySelector("p.grey:contains('Expiry') span")?.innerText.trim() || "N/A",
            "CVV": firstCard.querySelector("p.grey:contains('Expiry') span:nth-child(2)")?.innerText.trim() || "N/A",
            "Issuer": firstCard.querySelector("p.grey:contains('Issuer') span")?.innerText.trim() || "N/A",
            "Cardholder Name": firstCard.querySelector("p:contains('Holder:') span")?.innerText.trim() || "N/A",
        };
    });

    console.log(JSON.stringify(cardData, null, 2));
    await browser.close();
}

fetchCardDetails();
