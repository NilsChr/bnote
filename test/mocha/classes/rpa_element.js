class RPA_Element {
  type = "rpa_element";
  selector;
  page;

  highlightDuration = 1000;

  constructor(selector) {
    this.selector = selector;
  }

  setPage(page) {
    this.page = page;
  }

  highlight(highlightDuration) {
    return new Promise(async (resolve, reject) => {
      try {
        const element = await this.page.$(this.selector);
        let styleBefore = null;
        await this.page.evaluate(
          (el) => (styleBefore = el.style.border),
          element
        );
        await this.page.evaluate(
          (el) => (el.style.border = "5px solid blue"),
          element
        );
        await this.delay(highlightDuration || this.highlightDuration);
        await this.page.evaluate(
          (el) => (el.style.border = styleBefore),
          element
        );
        resolve();
      } catch (e) {
        reject(e);
      }
    })
      .catch()
      .finally();
  }

  checkExists(timeout) {
    return new Promise(async (resolve, reject) => {
      try {
        try {
          /**    OPTIONS TO IMPLEMENT
               {
                    waitFor: "visible",
                }
          */
          await this.page.waitForSelector(this.selector, { timeout: timeout || 5000 });
          resolve(true);
        } catch (e) {
          resolve(false);
        }
      } catch (e) {
        reject(e);
      }
    })
      .catch()
      .finally();
  }

  delay(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    })
      .catch()
      .finally();
  }
}

module.exports = RPA_Element;
