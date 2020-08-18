var assert = require("assert");
const { chromium } = require("playwright");

const RPA_Activites = require("./activites/index");

const elements = require("./elements");
const sequenceLogin = require("./sequences/sequenceLogin");
const sequenceLogout = require("./sequences/sequenceLogout");

let PORT = 8085;
let url = "http://localhost:" + PORT;

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

function injectPage(obj, page) {
  for (var elements in obj) {
    if (!obj[elements].type) {
      injectPage(obj[elements], page);
    } else {
      obj[elements].page = page;
    }
  }
}

describe("Playwright", function() {
  var browser;
  var page;
  before(async function() {
    this.timeout(10000);

    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
    await page.evaluate((_) => {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", "http://localhost:3000/api/test_setup", false); // false for synchronous request
      xmlHttp.send(null);
    });
    await page.goto(url);

    injectPage(elements, page);
  });

  after(async function() {
    browser.close();
  });

  it("Should login testuser 1", async function() {
    this.timeout(15000);
    await sequenceLogin(testUsers.testUser1);
  });

  it("Should create a new document", async function() {
    this.timeout(10000);
    await RPA_Activites.Delay(1000);

    let documentsBeforeAdd = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    await elements.state_dashboard.drawer.BTN_ADD_NEW.click(1000);
    let documentsAfterAdd = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documentsAfterAdd.length, documentsBeforeAdd.length + 1);
  });

  it("Should log out", async function() {
    this.timeout(10000);
    await sequenceLogout();
  });

  it("Should login testuser 2 and find 0 documents", async function() {
    this.timeout(15000);
    await sequenceLogin(testUsers.testUser2);

    let documents = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documents.length, 0);
  });

  it("Should create 4 new documents, rename and filter to verify", async function() {
    this.timeout(30000);
    for(let i = 0;i < 4; i++) {
        await elements.state_dashboard.drawer.BTN_ADD_NEW.click(400);
    }
    let documents = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documents.length, 4, "Four documents not created");
    for(let i = 0;i < 4; i++) {
        await elements.state_dashboard.drawer.LIST_DOCUMENTS.highlightChild(i, 100);
    }
    let deleteExists = await elements.state_dashboard.document.BTN_DELETE.checkExists();
    assert.equal(deleteExists, false, "BTN_Delete should not exist before pressing edit");
    await elements.state_dashboard.document.BTN_EDIT.click();
    deleteExists = await elements.state_dashboard.document.BTN_DELETE.checkExists();
    assert.equal(deleteExists, true, "BTN_Delete should exist after pressing edit");

    await elements.state_dashboard.drawer.LIST_DOCUMENTS.clickChild(2);
    await RPA_Activites.Delay(100);
    await elements.state_dashboard.document.INPUT_TITLE.typeInto('New title', 10, true);
    await RPA_Activites.Delay(100);
    await elements.state_dashboard.document.INPUT_TOPIC.typeInto('tropic thunder', 10, true);
    await RPA_Activites.Delay(100);

    await elements.state_dashboard.drawer.INPUT_SEARCH_TITLE.typeInto('ew', 10, true);
    await RPA_Activites.Delay(100);
    documents = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documents.length, 1, "Only one document in list after searching title");

    await elements.state_dashboard.drawer.INPUT_SEARCH_TITLE.typeInto('', 10, true);
    await RPA_Activites.Delay(100);
    documents = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documents.length, 4, "All documents after clearing first search");

    await elements.state_dashboard.drawer.INPUT_SEARCH_TOPIC.typeInto('rop', 10, true);
    await RPA_Activites.Delay(100);
    documents = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documents.length, 1, "Only one document in list after searching topic rop in tropic");

    await elements.state_dashboard.drawer.INPUT_SEARCH_TOPIC.typeInto('', 10, true);
    await RPA_Activites.Delay(100);
    documents = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documents.length, 4, "All documents after clearing second search");

    await elements.state_dashboard.drawer.INPUT_SEARCH_TOPIC.typeInto('hun', 10, true);
    await RPA_Activites.Delay(100);
    documents = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documents.length, 1, "Only one document in list after searching topic hun in thunder");
  })

  it('Should share the document with new title with testuser1 without edit rights', async function() {
    this.timeout(30000);
    let documents = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documents.length, 1);
    await elements.state_dashboard.drawer.LIST_DOCUMENTS.clickChild(0);
    await elements.state_dashboard.document.BTN_SHARE.click(500);
    await elements.state_dashboard.document.MODAL_SHARE.DIALOG.checkExists();
    await RPA_Activites.Delay(500);
    await elements.state_dashboard.document.MODAL_SHARE.BTN_COMBOBOX.click();

    await elements.state_dashboard.document.MODAL_SHARE.INPUT_USER.typeInto(testUsers.testUser1.name,50, true, true);

    await RPA_Activites.Delay(500);

    await page.press(elements.state_dashboard.document.MODAL_SHARE.BTN_COMBOBOX.selector,'ArrowDown');
    await RPA_Activites.Delay(1000);

    await page.press(elements.state_dashboard.document.MODAL_SHARE.BTN_COMBOBOX.selector,'Enter');
    await RPA_Activites.Delay(1000);

    await RPA_Activites.Delay(1000);

    await RPA_Activites.Delay(500);
    await elements.state_dashboard.document.MODAL_SHARE.BTN_SHARE.click(1500);

    await RPA_Activites.Delay(2000);

    let dialogExists = await elements.state_dashboard.document.MODAL_SHARE.DIALOG.checkExists();
    assert.equal(dialogExists, false, "Share dialog closed after sharing clicked");

    await sequenceLogout();

  })

  it('Should login user1 and find shared document', async function() {
    this.timeout(20000);
    await sequenceLogin(testUsers.testUser1);

    await elements.state_dashboard.drawer.INPUT_SEARCH_TOPIC.typeInto('hun', 10, true);
    await RPA_Activites.Delay(500);
    documents = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documents.length, 1, "Only one document in list after searching title");

  })

  it('Should verify edit button exists only for verified users', async function() {
    this.timeout(40000);

    await elements.state_dashboard.drawer.LIST_DOCUMENTS.clickChild(0);
    let editBtnExists = await elements.state_dashboard.document.BTN_EDIT.checkExists();
    assert.equal(editBtnExists, false, "Edit btn does not exist for user when they dont have edit rights");
    await sequenceLogout();

    await sequenceLogin(testUsers.testUser2);
    await elements.state_dashboard.drawer.INPUT_SEARCH_TOPIC.typeInto('hun', 10, true);
    await RPA_Activites.Delay(100);
    documents = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documents.length, 1, "Only one document in list after searching topic hun in thunder");
    await elements.state_dashboard.drawer.LIST_DOCUMENTS.clickChild(0);
    await elements.state_dashboard.document.BTN_EDIT.click();
    await elements.state_dashboard.document.BTN_SHARE.click(500);
    await elements.state_dashboard.document.MODAL_SHARE.DIALOG.checkExists();
    await RPA_Activites.Delay(500);
    await elements.state_dashboard.document.MODAL_SHARE.TEST_USER_CHECKBOX.click();
    await elements.state_dashboard.document.MODAL_SHARE.BTN_SHARE.click(1500);
    await sequenceLogout();

    await sequenceLogin(testUsers.testUser1);
    await elements.state_dashboard.drawer.INPUT_SEARCH_TOPIC.typeInto('hun', 10, true);
    await RPA_Activites.Delay(100);
    documents = await elements.state_dashboard.drawer.LIST_DOCUMENTS.getChildren();
    assert.equal(documents.length, 1, "Only one document in list after searching title");
    await elements.state_dashboard.drawer.LIST_DOCUMENTS.clickChild(0);
    editBtnExists = await elements.state_dashboard.document.BTN_EDIT.checkExists();
    assert.equal(editBtnExists, true, "Edit btn does not exist for user when they dont have edit rights");
  })

  it('Should not allow testuser1 to delete testuser2s document', async function() {
    await elements.state_dashboard.document.BTN_EDIT.click();
  })
});
