// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

const url = "https://news.ycombinator.com/newest";

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto(url);
  const html = await page.content();
  console.log(html);

  //Tests
  //works:
  //await page.click("id=43806657");
  //doesn't:
  //await page.click("tr");
}

(async () => {
  await sortHackerNewsArticles();

  //Begin Validation:

  //const html = (await (await fetch(url)).text()); // html as text
  //const doc = chromium.doc.parseFromString(html, 'text/html');
  //doc.title; doc.body;

  //Extract Json from Url
  /*fetch("https://news.ycombinator.com/newest")
  .then(response => response.blob())
  .then(blob => {
    console.log(blob)
    const html = new Document(blob);
    const html = new File([blob], "html", {type : blob.type})
    console.log(html)
  }
  );*/

  //We were only asked to validate the first 100, so filter those out.
  //const validateSize = 100;
  //const submissions = document.getElementsByClassName("athing submission");
  //const submissions = chromium.doc.getElementsByClassName("athing submission");
  //const recentSubmssions = subsmissions.slice(0, validateSize);
})();
