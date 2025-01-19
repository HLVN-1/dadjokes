const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: "Random Joke Fetcher (https://github.com/hlvn-1/dadjokes)",
  });
  const page = await context.newPage();

  // Load the HTML file
  await page.goto(`file://${__dirname}/index.html`);

  // Interact with the button
  console.log("Clicking the 'Get a Joke' button...");
  await page.click("#fetch-joke");

  // Wait for the joke to appear
  await page.waitForSelector("#joke");
  const joke = await page.textContent("#joke");

  console.log("Fetched Joke:", joke);

  await browser.close();
})();
