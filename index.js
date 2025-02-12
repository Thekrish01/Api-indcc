const axios = require("axios");
const cheerio = require("cheerio");

// URL to scrape
const url = "https://www.coolgenerator.com/credit-card-generator-india";

// Function to validate Luhn Algorithm
function luhnCheck(number) {
    let digits = number.replace(/\s/g, "").split("").map(Number);
    let sum = 0;
    let alternate = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let n = digits[i];
        if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
    }

    return sum % 10 === 0;
}

// Scrape credit card details
async function fetchCardDetails() {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
            }
        });

        const $ = cheerio.load(response.data);
        const firstCardNode = $(".list-unstyled.content-list li").first();

        if (!firstCardNode.length) {
            console.log(JSON.stringify({ error: "No card details found." }, null, 2));
            return;
        }

        // Extracting data
        const cardBrand = firstCardNode.find("p.grey span").first().text().trim();
        const cardNumber = firstCardNode.find("p.font-18 b span").first().text().trim();
        const expiry = firstCardNode.find("p.grey:contains('Expiry') span").first().text().trim();
        const cvv = firstCardNode.find("p.grey:contains('Expiry') span").eq(1).text().trim();
        const issuer = firstCardNode.find("p.grey:contains('Issuer') span").first().text().trim();
        const holder = firstCardNode.find("p:contains('Holder:') span").first().text().trim() || "N/A";
        const binNumber = cardNumber.replace(/\s/g, "").substring(0, 6);
        const cardType = /VISA|MASTERCARD/.test(cardBrand) ? "Credit Card" : "Debit Card";
        const country = "India";
        const cardLevel = "Classic"; // Basic assumption
        const isValidLuhn = luhnCheck(cardNumber) ? "Yes" : "No";

        // Final formatted response
        const selectedCard = {
            "Card Brand": cardBrand,
            "Card Type": cardType,
            "Card Level": cardLevel,
            "Credit Card No": cardNumber,
            "BIN Number": binNumber,
            "Expiry": expiry,
            "CVV": cvv,
            "Issuer": issuer,
            "Cardholder Name": holder,
            "Country of Issue": country,
            "Luhn Valid": isValidLuhn
        };

        console.log(JSON.stringify(selectedCard, null, 2));

    } catch (error) {
        console.error("Error fetching card details:", error.message);
    }
}

// Run the function
fetchCardDetails();