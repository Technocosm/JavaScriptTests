// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

//Website URL
const url = "https://news.ycombinator.com/newest";
//We don't need to validate beyond the first 100
const submissionsToDo = 100;
//How many fit on one page before needing to click "more"
const submissionsOnPage = 30;
//When we parse the html, the first element in the array will be discarded, so add 1.
const arraySize = submissionsOnPage + 1;
const subAge = [];
//Convert all time into seconds
const minuteSec = 60;
const hourSec = minuteSec * 60;
const daySec = hourSec * 24;
//NOTE: this would technically break if the post is from so long ago that it simply
//displays the date, rather than "___ ago". Though it took a lot of digging to find a
//that old to confirm how it works, so it seems unlikely a post that old would ever
//be in the top 100 results.

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto(url);
  
  const htmlStr = await page.content();
  parseHTMLString(htmlStr);

  //Tests
  //works:
  //await page.click("id=43806657");
  //doesn't:
  //await page.click("tr");
}

function parseHTMLString(htmlStr) {
  const submissions = htmlStr.split("athing submission", arraySize);

  //Ignore the first element of the array, as it won't be a submission to be checked
  for(let i = 1; i < arraySize; ++i)
  {
    //Parse each submission for time posted
    subAge[i - 1] = parseSubmission(submissions[i]);  
    console.log("Post #" + i + ": " + subAge[i-1]);
  }
}

function parseSubmission(sub){
  //Amount to multiply to get value in seconds for how long ago posted
  let sMult = 0;
  //Index of the character that will tell us how many seconds/minutes/hours/days ago
  let charIndex = 0;

  if(sub.includes("second"))
  {
    sMult = 1;
    charIndex = sub.indexOf("second") - 2;
  }
  else if (sub.includes("minute"))
  {
    sMult = minuteSec;
    charIndex = sub.indexOf("minute") - 2;
  }
  else if (sub.includes("hour"))
  {
    sMult = hourSec;
    charIndex = sub.indexOf("hour") - 2;
  }
  else if (sub.includes("day"))
  {
    sMult = daySec;
    charIndex = sub.indexOf("day") - 2;
  }

  //Find char that contains number to read
  const numChr1 = sub.charAt(charIndex - 1);
  //We include the space before to account for double digits
  const numChr2 = sub.charAt(charIndex);

  //Add small Digit
  let number = Number(numChr2);
  //Check for Double Digits
  if(numChr1 != '>')
  {
    number += (Number(numChr1) * 10);
  }
  return number * sMult;
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
