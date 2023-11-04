const express = require("express");
const puppeteer = require("puppeteer-extra");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const app = express();
const port = 5000;

app.get("/scrape/:place", async (req, res) => {
  const { place } = req.params;
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--start-maximized",
      "--lang=en-GB", //  '--start-fullscreen'
    ],
  });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-GB",
  });
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto("https://www.google.com/maps", {});
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "language", {
      get: function () {
        return "en-GB";
      },
    });
    Object.defineProperty(navigator, "languages", {
      get: function () {
        return ["en-GB", "en"];
      },
    });
  });
  await page.type("#searchboxinput", "mirpur", { delay: 500 });
  // const selectFirst = await page.$("div[jsinstance='0']");
  await page.click("div[jsinstance='0']");
  await page.waitForSelector(
    "#assistive-chips > div > div > div > div.e07Vkf.kA9KIf > div > div > div > div > div.rHNip.cRLbXd > div.dryRY > div:nth-child(1) > button"
  );
  console.log("selected");
  await page.click(
    "#assistive-chips > div > div > div > div.e07Vkf.kA9KIf > div > div > div > div > div.rHNip.cRLbXd > div.dryRY > div:nth-child(1) > button"
  );

  await page.waitForSelector(
    "#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div.JrN27d.SuV3fd.Zjt37e.TGiyyc > div.Ntshyc > div.L1xEbb > h1"
  );

  await page.click(
    "#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div.JrN27d.SuV3fd.Zjt37e.TGiyyc > div.Ntshyc > div.L1xEbb > h1"
  );

  const reached = await page.$(
    "#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd.QjC7t > div.m6QErb.tLjsW.eKbjU > div > p > span > span"
  );

  let startTime = Date.now();
  let timeLimit = 30000;
  const keyPressDelay = 1000;

  async function pressPageDownWithDelay() {
    console.log("This will run at least once.");
    await page.keyboard.press("PageDown");
  }

  do {
    await pressPageDownWithDelay();

    const isreached = await page.$(
      "#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd.QjC7t > div.m6QErb.tLjsW.eKbjU > div > p > span > span"
    );
    if (isreached || timeLimit) {
      console.log("reached");
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, keyPressDelay));
  } while (!reached);
  console.log("scrolled");

  await page.waitForSelector(".hfpxzc");

  const restaurantList = await page.$$(".CpccDe");
  console.log("selected list", restaurantList.length);

  for (const restaurant of restaurantList) {
    await restaurant.click();

    try {
      const selector = ".DUwDvf";
      await page.waitForSelector(selector, { timeout: 60000 });

      const restaurantNameSelector = await page.$(selector);

      if (restaurantNameSelector) {
        const restaurantName = await page.evaluate(
          (element) => element.textContent,
          restaurantNameSelector
        );
        console.log(restaurantName);
      } else {
        console.log("Restaurant name element not found.");
      }
    } catch (error) {
      console.error("Error occurred while extracting restaurant name:", error);
    }
    await page.waitForTimeout(1000);

    await page.waitForSelector(
      "#QA0Szd > div > div > div.w6VYqd > div.bJzME.Hu9e2e.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.BHymgf.eiJcBe.bJUD0c > div > div > div:nth-child(3) > span > button"
    );
    await page.click(
      "#QA0Szd > div > div > div.w6VYqd > div.bJzME.Hu9e2e.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.BHymgf.eiJcBe.bJUD0c > div > div > div:nth-child(3) > span > button"
    );
  }
});

app.listen(port, () => {
  console.log(`Express.js server is running on port ${port}`);
});
