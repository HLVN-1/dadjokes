const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: "Random Joke Fetcher (https://github.com/hlvn-1/dadjokes)",
  });
  const page = await context.newPage();

  // Load the HTML file
  await page.goto("https://random-joke-fetcher.vercel.app/");

  // Function to fetch a joke with a unique query
  const getJoke = async (previousJoke = "") => {
    // Click the 'Get a Joke' button
    await page.click("#fetch-joke");

    // Wait for the joke to change from the initial message
    await page.waitForFunction(() => {
      const jokeElement = document.getElementById("joke");
      return (
        jokeElement &&
        jokeElement.textContent !== "Click the button to get a joke!"
      );
    });

    // Fetch the joke
    const joke = await page.textContent("#joke");

    // Ensure the new joke is different from the previous one
    if (joke === previousJoke) {
      // If the joke is the same as the last one, retry by clicking again
      console.log("Same joke detected, retrying...");
      await page.waitForTimeout(200);
      return await getJoke(previousJoke);
    }

    return joke;
  };

  // Fetch and log multiple jokes
  const jokes = [];
  let previousJoke = "";

  for (let i = 0; i < 5; i++) {
    const joke = await getJoke(previousJoke);
    jokes.push(joke);
    previousJoke = joke;

    console.log(`Joke #${i + 1}:`, joke);
    // Add a small delay between fetches to avoid caching or fast retries
    const delay = i < 2 ? 1000 : 1000;
    await page.waitForTimeout(100);
  }

  await browser.close();
})();
