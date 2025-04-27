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
//Age of submissions
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
  
  //==========

  let submissionsCounted = 0;
  while(submissionsCounted < submissionsToDo)
  {
    //skip on first loop
    if(submissionsCounted > 0)
    {
      //Click "More" to load next page - More is located using XPath
      await page.locator('xpath=//*[@id="hnmain"]/tbody/tr[3]/td/table/tbody/tr[92]/td[2]/a').click();
      //From what I read this is a last resort, but from inspecting element I see no id, label,
      //role title, or even identifiable text to filter it out with ("More" can occur in news titles)
      //Only potential alternative is it may be possible to get the table it belongs to, and chain
      //further filters from there to find it, but I'm unsure how that would work.
    }

    const numCheck =  //Calculate the number of submissions to check for this page
    (submissionsCounted + submissionsOnPage) < submissionsToDo
    ?                 //If there are 30 or more left to do, do the full page
    submissionsOnPage : 
    submissionsToDo - submissionsCounted; //If not, only do the amount left

    const htmlStr = await page.content();                   //Get the html of the page as a string
    parseHTMLString(htmlStr, numCheck, submissionsCounted); //And Parse it for submissions to check

    //Add to counter
    submissionsCounted += numCheck;
  }

  RunValidationCheck();
}

function parseHTMLString(htmlStr, numberToCheck, indexFrom) {
  //Split html string by submissions (first element will be non-submission)
  const submissions = htmlStr.split("athing submission", arraySize);

  //Ignore the first element of the array, since it won't be a submission
  for(let i = 1; i < numberToCheck + 1; ++i)
  {
    //Parse each submission for time posted. amd record it into subAge
    subAge[indexFrom + (i - 1)] = parseSubmission(submissions[i]);  
    console.log("Post #" + (indexFrom + i) + ": " + subAge[indexFrom + (i - 1)]);
  }
}

function parseSubmission(sub){
  //Amount to multiply to get value in seconds for how long ago posted
  let sMult = 0;
  //Index of the character that will tell us how many minutes/hours/days ago
  let charIndex = 0;

  //Split text at the subline to ensure we don't accidentally pull from the title
  const subSplit = sub.split("class=\"subline\"");
  //Use the subline half of the text, not the title half
  const subTime = subSplit[1];

  //Find Measurement of Time used
  if (subTime.includes("minute"))
  {
    sMult = minuteSec;
    charIndex = subTime.indexOf("minute") - 2;
  }
  else if (subTime.includes("hour"))
  {
    sMult = hourSec;
    charIndex = subTime.indexOf("hour") - 2;
  }
  else if (subTime.includes("day"))
  {
    sMult = daySec;
    charIndex = subTime.indexOf("day") - 2;
  }

  //Find char that contains number to read
  const numChr1 = subTime.charAt(charIndex - 1);
  //We include the space before to account for double digits
  const numChr2 = subTime.charAt(charIndex);

  //Add small Digit
  let number = Number(numChr2);
  //Check for Double Digits
  if(numChr1 != '>')
  {
    number += (Number(numChr1) * 10);
  }
  //Return time in seconds (so multiply it up if it was given in mins/hrs/days)
  return number * sMult;
}

function RunValidationCheck()
{
  let validationSuccessful = true;
  let loop = true;
  let loopCount = 0;

  //iterate through the 100 posts
  while (loop)
  {
    if(subAge[loopCount] > subAge[loopCount + 1]) //If one is found to break the order...
    {
      loop = false;                               //Cancel the rest of the checks
      validationSuccessful = false;               //And flag the validation failed
    }
    else
    {
      ++loopCount;                                //Otherwise, conitnue on until the end of the array
      loop = loopCount < (submissionsToDo - 1) ? true : false;
    }
  }

  if(validationSuccessful)
  {
    console.log("First 100 posts are sorted correctly from newest to oldest.");
  }
  else
  {
    console.log("Validation failed! Check Post #" + loopCount + "for inconsistencies.");
  }
}

(async () => {
  await sortHackerNewsArticles();
})();
