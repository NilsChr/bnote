const assert = require("assert");
const elements = require("../elements");
const RPA_Activites = require("../activites/index");


/**
 *
 * @param {int} user user to login
 */
function sequenceLogin(user) {
  return new Promise(async function(resolve) {

    await elements.state_login.BTN_GOOGLE_SIGN_IN.checkExists();
    await elements.state_login.BTN_GOOGLE_SIGN_IN.click();
    await elements.state_login.INPUT_EMAIL.typeInto(
     user.email,
      5
    );
    await elements.state_login.BTN_EMAIL_NEXT.click();
    await elements.state_login.INPUT_PASSWORD.typeInto(
      user.password,
      5
    );
    await elements.state_login.BTN_SIGN_IN.click();
    let logoExists = await elements.state_dashboard.navbar.LOGO.checkExists();
    await RPA_Activites.Delay(1000);
    assert.equal(logoExists, true);
    
    resolve();
  }).catch().finally();
}

module.exports = sequenceLogin;
