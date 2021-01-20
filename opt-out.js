const puppeteer = require("puppeteer");
const prompt = require("prompt-sync")();

async function run() {
  const username = prompt("Enter your mcgill username (mcgill email): ");
  const password = prompt.hide(
    "Enter your mcgill password (you cannot see how many characters you have entered): "
  );
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto("https://horizon.mcgill.ca");
    await page.waitForSelector("#mcg_un");
    await page.type("#mcg_un", username);
    await page.type("#mcg_pw", password);
    await page.click("#mcg_un_submit");

    await page.waitForNavigation();
    // go to the Fee Opt-out page
    await page.goto(
      "https://horizon.mcgill.ca/pban1/bztkopto.pm_opt_out_processing"
    );

    const linkSelector = 'a[href^="/pban1/bztkopto.pm_agree_opt_out"]';
    const optLinks = await page.$$(linkSelector);
    const optOut = 'input[value="Opt-out"]';
    const goBack = 'input[value="Go Back"]';

    for (let link of optLinks) {
      await page.waitForSelector(linkSelector);
      await page.click(linkSelector);
      await page.waitForSelector(optOut);
      await page.click(optOut);
      await page.waitForSelector(goBack);
      await page.click(goBack);
    }
  } catch (e) {
    console.log(e);
  }

  console.log("Money saved");
  await browser.close();
}

run();
