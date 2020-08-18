import SELECTORS from "./puppeteer_selectors";

const PUPPETEER_HELPERS = {
  delay: function(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
  },
  signInWithUser: function(page, user) {
    return new Promise(async (resolve, reject) => {
      try {
        await page.waitForSelector(SELECTORS.STATE_LOGIN.googleSignInWithEmail);
        await page.click(SELECTORS.STATE_LOGIN.googleSignInWithEmail);

        await page.waitForSelector(
          SELECTORS.STATE_LOGIN.googleSignInInputEmail
        );
        await page.focus(SELECTORS.STATE_LOGIN.googleSignInInputEmail);
        await page.keyboard.type(user.email);
        await page.keyboard.press("Enter");

        await page.waitForSelector(
          SELECTORS.STATE_LOGIN.googleSignInInputPassword
        );
        await page.focus(SELECTORS.STATE_LOGIN.googleSignInInputPassword);
        await page.keyboard.type(user.password);

        await page.keyboard.press("Enter");

        await page.waitForSelector(SELECTORS.STATE_DASHBOARD.navbar.title);
        await expect(page).toMatch("BLOGAL");
        await this.delay(500);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  signOut: function(page) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.delay(100);

        await page.waitForSelector(SELECTORS.STATE_DASHBOARD.navbar.avatar);
        await page.click(SELECTORS.STATE_DASHBOARD.navbar.avatar);
        await this.delay(100);
        await page.waitForSelector(SELECTORS.STATE_DASHBOARD.navbar.btn_logout);
        await page.click(SELECTORS.STATE_DASHBOARD.navbar.btn_logout);
        await this.delay(100);
        await page.waitForSelector(SELECTORS.STATE_LOGIN.googleSignInInputEmail);

    //    await expect(page).toMatch("google");
    //    await this.delay(1000);
        resolve();
      } catch (e) {
        console.log("SIGNOUT FAILED", e);
        reject(e);
      }
    });
  },
  getDocumentsLength: function(page) {
    return new Promise(async (resolve, reject) => {
      try {
        let $parent = await page.$(
          SELECTORS.STATE_DASHBOARD.drawer.list_documents
        );
        let $childs = await $parent.$$(":scope > *");
        resolve($childs.length);
      } catch (e) {
        reject(e);
      }
    });
  },
};

export default PUPPETEER_HELPERS;