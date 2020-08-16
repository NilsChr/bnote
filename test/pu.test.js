import "expect-puppeteer";
import axios from "axios";
jest.mock("axios");

const testUsers = {
  testUser1: {
    email: "testuser1@test.com",
    name: "testuser1",
    password: "testuser1",
  },
  testUser2: {
    email: "testuser2@test.com",
    name: "testuser2",
    password: "testuser2",
  },
};

const PORT = 8085;
const TEST_TIMEOUT = 60000;

const SELECTORS = {
  googleSignInWithEmail:
    "#firebaseui-auth-container > div > div.firebaseui-card-content > form > ul > li:nth-child(1) > button",
  googleSignInInputEmail: "#ui-sign-in-email-input",
  googleSignInInputPassword: "#ui-sign-in-password-input",

  TOOLBAR_TITLE:
    "#app > div > main > div > div > header > div > div.v-toolbar__title",

  DOCUMENTS_LIST: "#documents-list",

  BTN_NEW_DOCUMENT: "#blogal-btn-addnewdoc",
};

function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}

async function signInWithUser(page, user) {
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

  await page.waitForSelector(SELECTORS.TOOLBAR_TITLE);
  await expect(page).toMatch("BLOGAL");
  await delay(500);

}

async function signOut(page) {
  let navBarAvatar =
    "#app > div.v-application--wrap > main > div > div > header > div > div.v-avatar > img";
  await page.waitForSelector(navBarAvatar);
  await page.click(navBarAvatar);
  await delay(500);

  let btnLogout = "#btnlogout > div";
  await page.waitForSelector(btnLogout);
  await page.click(btnLogout);
  await delay(500);

  await expect(page).toMatch("google");
  await delay(500);

}

function getDocumentsLength(page) {
  return new Promise(async (resolve, reject) => {
    try {
      let $parent = await page.$(SELECTORS.DOCUMENTS_LIST);
      let $childs = await $parent.$$(":scope > *");
      resolve($childs.length);
    } catch (e) {
      reject(e);
    }
  });
}

describe("BNOTE", () => {
  beforeAll(async (done) => {
    console.log("Tests starting");
    //let t = await axios.get('http://localhost:3000/api/test_setup');

    jest.setTimeout(30000);
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.evaluate((_) => {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", "http://localhost:3000/api/test_setup", false); // false for synchronous request
      xmlHttp.send(null);

      // this will be executed within the page, that was loaded before
      //document.body.style.background = '#000';
    });
    done();
  }, TEST_TIMEOUT);

  it("test", async () => {
    expect(1).toBe(1);
  });

  it.skip(
    "Should log in and out for testuser 1 and 2",
    async () => {
      const page = await context.newPage();
      await page.goto("http://localhost:" + PORT + "/index.html", {
        waitUntil: "domcontentloaded",
      });
      await signInWithUser(page, testUsers.testUser1);
     // await delay(1000);
      await signOut(page);
      //await delay(1000);
      await expect(page).toMatch("google");
      await signInWithUser(page, testUsers.testUser2);
     // await delay(1000);
      await signOut(page);
    //  await delay(1000);
      await expect(page).toMatch("google");
    },
    TEST_TIMEOUT
  );

  it.skip(
    "Should log in and count documents to be 0 for both test users",
    async () => {
      const page = await context.newPage();
      await page.goto("http://localhost:" + PORT + "/index.html", {
        waitUntil: "domcontentloaded",
      });
      await signInWithUser(page, testUsers.testUser1);
     // await delay(1000);

      let listElements = await getDocumentsLength(page);
      expect(listElements).toBe(0);
      await signOut(page);
   
   //   await delay(1000);
    },
    TEST_TIMEOUT
  );

  it.skip(
    "Should create a new document and verify that it exists in the list",
    async () => {
      const page = await context.newPage();
      await page.goto("http://localhost:" + PORT + "/index.html", {
        waitUntil: "domcontentloaded",
      });
      await signInWithUser(page, testUsers.testUser1);
   //   await delay(1000);
      let childsBeforeNewAdded = await getDocumentsLength(page);


      await page.waitForSelector(SELECTORS.BTN_NEW_DOCUMENT);
      await page.click(SELECTORS.BTN_NEW_DOCUMENT);
      await delay(1000);
      let childsAfterNewAdded = await getDocumentsLength(page);
      expect(childsAfterNewAdded).toBe(childsBeforeNewAdded + 1);

      await signOut(page);
  //    await delay(1000);

      await signInWithUser(page, testUsers.testUser2);
  //    await delay(1000);

      let listElements = await getDocumentsLength(page);
      expect(listElements).toBe(0);
    },
    TEST_TIMEOUT
  );

  it("markup", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:" + PORT + "/index.html", {
      waitUntil: "domcontentloaded",
    });
    //await signInWithUser(page, testUsers.testUser1);
    const element = await page.$(SELECTORS.googleSignInWithEmail);

    await page.evaluate(el => el.style.border = "5px solid blue", element);
    await delay(5000);
  })

 /* it("create", async () => {
    await page.goto("http://localhost:" + PORT + "/index.html", {
      waitUntil: "domcontentloaded",
    });
    await signInWithUser(page, testUsers.testUser1);
    await delay(1000);
    let childsBeforeNewAdded = await getDocumentsLength(page);
    await page.waitForSelector(SELECTORS.BTN_NEW_DOCUMENT);
    await page.click(SELECTORS.BTN_NEW_DOCUMENT);
    await delay(1000);
  }, 10000);*/
});
