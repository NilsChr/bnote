const { chromium } = require("playwright");

var assert = require("assert");

function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}
var app = new Application_Control("bnote", "http://localhost:8085/");
let state_login = new RPA_STATE('login');
state_login.addElement(new Element('button',  "btn_google_signin", '//*[@id="firebaseui-auth-container"]/div/div[1]/form/ul/li[1]/button'));
app.addState(state_login);

describe("Playwright", function() {
  it("Should launch browser", async function() {
    this.timeout(10000);
    /*let app = new Application_Control("bnote", "http://localhost:8085/");
    let state_login = new RPA_STATE('login');
    state_login.addElement(new Element('button',  "btn_google_signin", '//*[@id="firebaseui-auth-container"]/div/div[1]/form/ul/li[1]/button'));
    await app.addState(state_login);*/

    await app.launch();
    await app.setState(state_login);
    await state_login.click('btn_google_signin', {highlight: true, highlightTime: 2000, waitAfter: 100});
    await delay(5000);
    await app.close();
  });
});

function Application_Control(title, url) {
  this.title = title;
  this.url = url;
  this.browser;
  this.page;

  this.states = [];
  this.currentState = null;

  this.launch = function() {
    return new Promise(async (resolve, reject) => {
      try {
        this.browser = await chromium.launch({ headless: false });
        this.page = await this.browser.newPage();
        await this.goto(this.url);
        resolve();
      } catch (e) {
        reject(e);
      }
    })
      .catch((e) => {})
      .finally();
  };

  this.close = async function() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.browser.close();
        resolve();
      } catch (e) {
        console.log(e);
        reject();
      }
    })
      .catch((e) => {})
      .finally();
  };

  this.goto = async function(url) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.page.goto(url);

        resolve();
      } catch (e) {
        reject();
      }
    });
  };

  this.addState = function(state) {
    this.states.push(state);
    this.currentState = state;
  };

  this.setState = function(state) {
    return new Promise(async (resolve, reject) => {
      try {
        this.currentState = state;
        this.currentState.page = this.page;
       // await this.currentState.verifyState(this.page);
        await this.verifyState();
        resolve();
      } catch (e) {
        reject();
      }
    })
      .catch()
      .finally();
  }

  this.verifyState = function() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.currentState.verifyState(this.page);
        resolve();
      } catch (e) {
        reject();
      }
    })
      .catch()
      .finally();
  };
}

function RPA_STATE(title) {
  this.title = title;
  this.page = null;
  this.elements = [];
  this.addElement = function(element) {
    this.elements.push(element);
  };
  this.verifyState = async function(page) {
    return new Promise(async (resolve, reject) => {
      try {
        for (let i = 0; i < this.elements.length; i++) {
          await page.waitForSelector(this.elements[i].selector);
        }
        resolve();
      } catch (e) {
        reject();
      }
    })
      .catch()
      .finally();
  }
  this.actions = [];
  this.addAction = function(key, action) {
    this.actions[key] = action;
  }
  this.doAction = function(key) {
    this.actions[key]();
  }

  this.click = function(title, opt) {
    let btn = this.elements.filter(e => e.type == 'button' && e.title == title)[0];
    return new Promise(async (resolve, reject) => {
      if(!btn) reject();
      try {
        if(opt.highlight) {
          await btn.highlight(this.page, opt.highlightTime);
        }
        await this.page.click(btn.selector);
        await delay(opt.waitAfter);
        resolve();
      } catch(e) {
        reject();
      }
    }).catch().finally();
  }
}

function Element(type, title, selector) {
  this.type = type;
  this.title = title;
  this.selector = selector;
  this.highlight = function(page, duration) {
    return new Promise(async (resolve, reject) => {
      try {
        const element = await page.$(this.selector);
        await page.evaluate(el => el.style.border = "5px solid blue", element);
        await delay(duration);
        resolve();
      } catch(e) {
        reject();
      }
    }).catch().finally();
  }
}
