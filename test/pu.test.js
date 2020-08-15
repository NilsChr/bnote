import "expect-puppeteer";

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

const SELECTORS = {
  googleSignInWithEmail:
    "#firebaseui-auth-container > div > div.firebaseui-card-content > form > ul > li:nth-child(1) > button",
  googleSignInInputEmail: "#ui-sign-in-email-input",
  googleSignInInputPassword: "#ui-sign-in-password-input",

  TOOLBAR_TITLE:
    "#app > div > main > div > div > header > div > div.v-toolbar__title",
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
}

async function signOut(page) {
  let navBarAvatar =
    "#app > div.v-application--wrap > main > div > div > header > div > div.v-avatar > img";
  await page.waitForSelector(navBarAvatar);
  await page.click(navBarAvatar);
  await delay(1000);

  let btnLogout = "#btnlogout > div";
  await page.waitForSelector(btnLogout);
  await page.click(btnLogout);
  await delay(1000);

  await expect(page).toMatch("google");
}

describe("BNOTE", () => {
  beforeAll(async () => {
    jest.setTimeout(15000);
    const context = await browser.createIncognitoBrowserContext();
  });
  it("Should log in and out for testuser 1 and 2", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:" + PORT + "/index.html", {
      waitUntil: "domcontentloaded",
    });
    await signInWithUser(page, testUsers.testUser1);
    await delay(1000);
    await signOut(page);
    await delay(1000);
    await expect(page).toMatch("google");
    await signInWithUser(page, testUsers.testUser2);
    await delay(1000);
    await signOut(page);
    await expect(page).toMatch("google");
  });
});
