const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: "Random Joke Fetcher (https://github.com/hlvn-1/dadjokes)",
  });
  const page = await context.newPage();

  // Load the HTML file
  await page.goto("https://random-joke-fetcher.vercel.app/");

  // Interact with the button
  console.log("Clicking the 'Get a Joke' button...");
  await page.click("#fetch-joke");

  // Wait for the joke to change
  await page.waitForFunction(() => {
    const jokeElement = document.getElementById("joke");
    return (
      jokeElement &&
      jokeElement.textContent !== "Click the button to get a joke!"
    );
  });

  // Get the updated joke text
  const joke = await page.textContent("#joke");
  console.log("Fetched Joke:", joke);

  await browser.close();
})();
