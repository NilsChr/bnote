import "expect-puppeteer";
//import puppeteer from "puppeteer";

const testUsers = {
  testUser1: {
    email: "testuser1@test.com",
    name: "testuser1",
    password: "testuser1",
  },
  testUser1: {
    email: "testuser2@test.com",
    name: "testuser2",
    password: "testuser2",
  },
};

const SELECTORS = {
  googleSignInWithEmail:
    "#firebaseui-auth-container > div > div.firebaseui-card-content > form > ul > li:nth-child(1) > button",
  googleSignInInputEmail: "#ui-sign-in-email-input",
  googleSignInInputPassword: "#ui-sign-in-password-input",

  TOOLBAR_TITLE:
    "#app > div > main > div > div > header > div > div.v-toolbar__title",
};

const PORT = 8085;

function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}

const waitForResponse = (page, url) => {
  return new Promise((resolve) => {
    page.on("response", function callback(response) {
      if (response.url() === url) {
        resolve(response);
        page.removeListener("response", callback);
      }
    });
  });
};

async function signInWithUser(user) {
  /*let googleSignInEmail =
      "#firebaseui-auth-container > div > div.firebaseui-card-content > form > ul > li:nth-child(1) > button";
    await page.waitForSelector(googleSignInEmail);
    await page.click(googleSignInEmail);

    let inputEmail = "#ui-sign-in-email-input";
    await page.waitForSelector(inputEmail);
    await page.focus(inputEmail);
    await page.keyboard.type(user.email);
    await page.keyboard.press("Enter");

    let inputPW = "#ui-sign-in-password-input";
    await page.waitForSelector(inputPW);
    await page.focus(inputPW);
    await page.keyboard.type(user.password);*/

  await page.waitForSelector(SELECTORS.googleSignInWithEmail);
  await page.click(SELECTORS.googleSignInWithEmail);

  await page.waitForSelector(SELECTORS.googleSignInInputEmail);
  await page.focus(SELECTORS.googleSignInInputEmail);
  await page.keyboard.type(user.email);
  await page.keyboard.press("Enter");

  await page.waitForSelector(SELECTORS.googleSignInInputPassword);
  await page.focus(SELECTORS.googleSignInInputPassword);
  await page.keyboard.type(user.password);

  await page.keyboard.press("Enter");

  //await page.goto("http://localhost:"+PORT+"/",  {waitUntil: 'domcontentloaded'});
  //await jestPuppeteer.debug();

  await page.waitForSelector(SELECTORS.TOOLBAR_TITLE);
  await expect(page).toMatch("BLOGAL");
}

async function signOut() {
  /*
    let navBarAvatar = "#app > div > main > div > div > header > div > div.v-avatar > img";
    await page.waitForSelector(navBarAvatar);
    await page.click(navBarAvatar);
*/
  let btnLogout = "#list-item-43 > div";
  await page.waitForSelector(btnLogout);
  await page.click(btnLogout);

  await expect(page).toMatch("google");
}

describe("Google", () => {
  beforeAll(async () => {
    jest.setTimeout(15000);
    await page.setCacheEnabled(false);

    await page.setViewport({ width: 3072, height: 1920 });
    await page.goto("http://localhost:" + PORT + "/index.html", {
      waitUntil: "domcontentloaded",
    });
  });

  it("should sign in with both users", async () => {
    await signInWithUser(testUsers.testUser1);
    await page.goto("http://www.google.com");
    await page.reload({ waitUntil: "networkidle2" });
    await context.close();

    await page.goto("http://localhost:" + PORT + "/index.html", {
      waitUntil: "domcontentloaded",
    });
    await signInWithUser(testUsers.testUser1);

    //await signInWithUser(testUsers.testUser1);

    //const browser = await puppeteer.launch();
    //const page = await browser.newPage();

    /*
        jest.setTimeout(15000);
        const browser = await puppeteer.launch();
        const page = await browser.newPage()
        await page.goto("http://localhost:"+PORT+"/index.html", {waitUntil: 'domcontentloaded'});
        await signInWithUser(testUsers.testUser1);
        */
    //await browser.close();
    //await signInWithUser(testUsers.testUser2);

    /*
    let googleSignInEmail =
      "#firebaseui-auth-container > div > div.firebaseui-card-content > form > ul > li:nth-child(1) > button";
    await page.waitForSelector(googleSignInEmail);
    await page.click(googleSignInEmail);

    let inputEmail = "#ui-sign-in-email-input";
    await page.waitForSelector(inputEmail);
    await page.focus(inputEmail);
    await page.keyboard.type(testUsers.testUser1.email);
    await page.keyboard.press("Enter");

    let inputPW = "#ui-sign-in-password-input";
    await page.waitForSelector(inputPW);
    await page.focus(inputPW);
    await page.keyboard.type(testUsers.testUser1.password);

    await page.keyboard.press("Enter");

    await page.goto("http://localhost:"+PORT+"/",  {waitUntil: 'domcontentloaded'});
    await page.screenshot({
      path: "example.jpg",
      fullPage: true,
    });

    */
  });
});
