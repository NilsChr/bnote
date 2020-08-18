const RPA_Element = require("./rpa_element");
const elements = require("../elements");
const RPA_Button = require("./rpa_button");

class RPA_List extends RPA_Element {
  type = "rpa_list";
  constructor(selector, getChildSelector) {
    super(selector);
    this.getChildSelector = getChildSelector;
  }

  getChildren() {
    return new Promise(async (resolve, reject) => {
      try {
          await this.page.waitForSelector(this.selector);
        let $parent = await this.page.$(this.selector);
        let $childs = await $parent.$$(":scope > *");
        resolve($childs);
      } catch (e) {
        reject(e);
      }
    })
      .catch()
      .finally();
  }

  async highlightChild(index, highlightDuration) {
    return new Promise(async (resolve, reject) => {
      try {
        let sel = this.getChildSelector(index);
        let el = new RPA_Element(sel);
        el.page = this.page;

        await el.highlight(highlightDuration);
        resolve();
      } catch (e) {
        reject(e);
      }
    })
      .catch()
      .finally();
  }

  async clickChild(index) {
    return new Promise(async (resolve, reject) => {
      try {
        let sel = this.getChildSelector(index);
        let el = new RPA_Button(sel);
        el.page = this.page;

        await el.click();
        resolve();
      } catch (e) {
        reject(e);
      }
    })
      .catch()
      .finally();
  }
}

module.exports = RPA_List;
