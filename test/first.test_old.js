import "expect-puppeteer";

const testUsers = {
    testUser1: {
        email:'testuser1@test.com',
        name: 'testuser1',
        password: 'testuser1'
    }
}

/*
const puppeteer = require("puppeteer");

test("adds 1 + 2 to equal 3", async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://google.com");
    jestPuppeteeer.debug();
  setTimeout(() => {
    //await page.screenshot({path: 'screenshot.png'});
    browser.close();
    expect(1 + 2).toBe(3);
  }, 5000);
});
*/

test('adds 1 + 2 to equal 3', () => {
    expect(1+2).toBe(3);
});

/*
describe('Google', () => {
  beforeAll(async () => {
    await page.goto('https://google.com')
  })

  it('should display "google" text on page', async () => {
    await expect(page).toMatch('google')
  })
})
*/

/*
describe('Google', () => {
    beforeAll(async () => {
        jest.setTimeout(15000);

      await page.goto('http://localhost:8081');
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136");

    })
  
    it('should display "google" text on page', async () => { 
       // await jestPuppeteer.debug()

       await expect(page).toMatch('Google')

       let googleBtnSelector = '#firebaseui-auth-container > div > div.firebaseui-card-content > form > ul > li > button';
       await page.waitForSelector(googleBtnSelector);
       await page.click(googleBtnSelector);

       let googleSignInEmail = '#identifierId';
       await page.waitForSelector(googleSignInEmail);
       await page.focus(googleSignInEmail)
       await page.keyboard.type('guleful')

       let nextBtn = "#identifierNext > div > button";
       await page.waitForSelector(nextBtn);
       await page.click(nextBtn);

//       await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

       await page.waitForSelector(googleSignInEmail);
       await page.focus(googleSignInEmail)
       await page.keyboard.type('guleful')

       await page.waitForSelector(nextBtn);
       await page.click(nextBtn);

       let googleSignInPW = "#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input";
       await page.waitForSelector(googleSignInPW);
       await page.focus(googleSignInPW)
       await page.keyboard.type('1q4r2w3e')
       //await page.$eval(googleSignInEmail, el => el.value = 'test@example.com');

       let nextBtnPW = "#passwordNext > div > button";
       await page.waitForSelector(nextBtnPW);
       await page.click(nextBtnPW);
      
       //await jestPuppeteer.debug();
       //await expect(page).toMatch('Sign in')
       await jestPuppeteer.debug();
    })
  })
  
*/

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

describe('Google', () => {
    beforeAll(async () => {
        jest.setTimeout(60000);

      //await page.goto('https://stackoverflow.com/users/login');
      await page.goto('https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=717762328687-iludtf96g1hinl76e4lc1b9a82g457nn.apps.googleusercontent.com&scope=profile%20email&redirect_uri=https%3A%2F%2Fstackauth.com%2Fauth%2Foauth2%2Fgoogle&state=%7B%22sid%22%3A1%2C%22st%22%3A%2259%3A3%3ABBC%2C16%3Ae715708188e1f673%2C10%3A1597428631%2C16%3A06ce7ca9ea260471%2Ccc6cfd32947cea9a070cb056244336ab28b14462bb4dfc6651c710e8ece231a6%22%2C%22cdl%22%3Anull%2C%22cid%22%3A%22717762328687-iludtf96g1hinl76e4lc1b9a82g457nn.apps.googleusercontent.com%22%2C%22k%22%3A%22Google%22%2C%22ses%22%3A%22117d8a8b3a22474ebd59b5b95182f95b%22%7D&response_type=code&flowName=GeneralOAuthFlow')
      //await jestPuppeteer.debug();

    })

    it('should login to google', async () => { 
        /*
        let selGoogleSignIn = "#openid-buttons > button.grid--cell.s-btn.s-btn__icon.s-btn__google.bar-md.ba.bc-black-3";
        await page.waitForSelector(selGoogleSignIn);
        await page.click(selGoogleSignIn);
        

        await page.waitFor('input[name=email]');
        await page.focus('input[name=email]')
        await page.keyboard.type('guleful')
        */
        let googleSignInEmail = '#identifierId';
       await page.waitForSelector(googleSignInEmail);
       await page.focus(googleSignInEmail)
       await page.keyboard.type('guleful')

       let nextBtn = "#identifierNext > div > button";
       await page.waitForSelector(nextBtn);
       await page.click(nextBtn);

        await delay(5000)

       let googleSignInPW = "#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input";
       await page.waitForSelector(googleSignInPW);
       await page.focus(googleSignInPW)
       await page.keyboard.type('1q4r2w3e')
       await delay(1000)

       await page.keyboard.press('Enter');       
       await delay(2000)

       await page.goto('http://localhost:8081');
       await delay(60000)

       await expect(page).toMatch('BLOGAL')
       await delay(60000)

       //await page.$eval(googleSignInEmail, el => el.value = 'test@example.com');

       //let nextBtnPW = "#passwordNext > div > button";
       //await page.waitForSelector(nextBtnPW);
       //await page.click(nextBtnPW);
      await jestPuppeteer.debug();

    });
});