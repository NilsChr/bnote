const RPA_Element = require("./rpa_element");

class RPA_Button extends RPA_Element {
  type = "rpa_button";
  constructor(selector) {
    super(selector);
  }

  click = function(delayAfter) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.page.waitForSelector(this.selector);
        await this.page.click(this.selector);
        await this.delay(delayAfter || 100);
        resolve();
      } catch (e) {
        reject(e);
      }
    })
      .catch()
      .finally();
  };
}

module.exports = RPA_Button;
