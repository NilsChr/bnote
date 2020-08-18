const RPA_Element = require("./rpa_element");

 class RPA_Input extends RPA_Element {
  type = "rpa_input";

  constructor(selector) {
    super(selector);
  }

  typeInto = function(text, typeDelay, clearInput, clickBefore) {
    return new Promise(async (resolve, reject) => {
      try {
        if(clearInput) {
            await this.page.click(this.selector);
            await this.page.keyboard.press('Meta+a');
            await this.delay(50);

            await this.page.keyboard.press('Backspace');
            await this.delay(50);
        }
        if(clickBefore) {
            await this.click();
        }
        await this.page.type(this.selector, text, { delay: typeDelay });
        await this.delay(100);
        resolve();
      } catch (e) {
        reject(e);
      }
    })
      .catch()
      .finally();
  };

  click = function() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.page.click(this.selector);
        await this.delay(100);
        resolve();
      } catch (e) {
        reject(e);
      }
    })
      .catch()
      .finally();
  };
}

module.exports = RPA_Input;