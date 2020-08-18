const RPA_Button = require("./classes/rpa_button");
const RPA_Input = require("./classes/rpa_input");
const RPA_Element = require("./classes/rpa_element");
const RPA_List = require("./classes/rpa_list");

const elements = {
  state_login: {
    BTN_GOOGLE_SIGN_IN: new RPA_Button(
      '//*[@id="firebaseui-auth-container"]/div/div[1]/form/ul/li[1]/button'
    ),
    INPUT_EMAIL: new RPA_Input('//*[@id="ui-sign-in-email-input"]'),
    INPUT_PASSWORD: new RPA_Input('//*[@id="ui-sign-in-password-input"]'),
    BTN_SIGN_IN: new RPA_Button(
      '//*[@id="firebaseui-auth-container"]/div/form/div[3]/div[2]/button'
    ),
    BTN_EMAIL_NEXT: new RPA_Button(
      '//*[@id="firebaseui-auth-container"]/div/form/div[3]/div/button[2]'
    ),
  },
  state_dashboard: {
    navbar: {
      LOGO: new RPA_Element(
        '//*[@id="app"]/div[1]/main/div/div/header/div/div[1]'
      ),
      AVATAR: new RPA_Button(
        '//*[@id="app"]/div/main/div/div/header/div/div[4]/img'
      ),
      BTN_LOGOUT: new RPA_Button('//*[@id="btnlogout"]/div'),
    },
    drawer: {
      LIST_DOCUMENTS: new RPA_List('//*[@id="documents-list"]', function(index) {
        return '//*[@id="documents-list"]/div[' + (index+1) + ']'
      },),
      BTN_ADD_NEW: new RPA_Button('//*[@id="blogal-btn-addnewdoc"]'),
      INPUT_SEARCH_TITLE: new RPA_Input('//*[@id="input-24"]'),
      INPUT_SEARCH_TOPIC: new RPA_Input('//*[@id="input-27"]')
    },
    document: {
      BTN_EDIT: new RPA_Button(
        '//*[@id="app"]/div/main/div/div/div[1]/div/div[3]/div/button'
      ),
      BTN_DELETE: new RPA_Button('//*[@id="app"]/div/main/div/div/div[1]/div/div[3]/div/div[2]/button'),
      BTN_SHARE: new RPA_Button('//*[@id="app"]/div/main/div/div/div[1]/div/div[3]/div/div[1]/button'),
      INPUT_TITLE: new RPA_Input('//*[@id="input-38"]'),
      INPUT_TOPIC: new RPA_Input('//*[@id="input-41"]'),
      MODAL_SHARE: {
          DIALOG: new RPA_Element('//*[@id="app"]/div[3]/div'),
          INPUT_USER: new RPA_Input('//*[@id="app"]/div[3]/div/div/div[2]/div[2]/div/div[1]/div[1]'),
          BTN_COMBOBOX: new RPA_Button('//*[@id="app"]/div[3]/div/div/div[2]/div[2]/div'),
          BTN_COMBOBOX_OPTION_USER1: new RPA_Button('//*[@id="list-item-86-0"]'), //*[@id="list-item-86-0"]
          BTN_COMBOBOX_FIRST_OPTION: new RPA_Button('//*[@id="list-90"]'),
          BTN_CANCEL: new RPA_Button('//*[@id="app"]/div[3]/div/div/div[3]/button[1]'),
          BTN_SHARE: new RPA_Button('//*[@id="app"]/div[3]/div/div/div[3]/button[2]'),
          TEST_USER_SELECT: new RPA_Button('//*[@id="list-item-74-0"]'),
          TEST_USER_CHECKBOX: new RPA_Button('//*[@id="app"]/div[3]/div/div/div[2]/div[2]/div/div[1]/div[1]/div[1]/span/span/div/div/div[1]/div/div')
      }
    },
  },
};

module.exports = elements;
