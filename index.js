// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
}

(async () => {
  await sortHackerNewsArticles();

  //Begin Validation:

  //Get all submissions
  const json =
  fetch("https://news.ycombinator.com/newest")              //Fetch from URL
  .then(response =>                                         //(We don't have the html)
    {
      if(response.ok)                                       //Error Check
      {
        return response.json();                             //Return Result on Success
      }
      else
      {
        throw new Error('Response not ok');                 //Failstate
      }
    })
  .catch(error => console.error("Error fetching!", error)); //Log Error
  
  //Extract Submissions from Json
  const submissions = json.getElementsByClassName("athing submission");

  //We were only asked to validate the first 100, so filter those out.
  const validateSize = 100;
  submissions = submissions.slice(0, validateSize);
})();
