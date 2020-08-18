const assert = require("assert");
const elements = require("../elements");
const RPA_Activites = require("../activites/index");


/**
 * Should log out user
 */
function sequenceLogout() {
  return new Promise(async function(resolve) {    
    await RPA_Activites.Delay(500);
    await elements.state_dashboard.navbar.AVATAR.click();
    await elements.state_dashboard.navbar.BTN_LOGOUT.click();
    await RPA_Activites.Delay(500);
    let exists = await elements.state_login.BTN_GOOGLE_SIGN_IN.checkExists();
    assert.equal(exists, true);
    resolve();
  }).catch().finally();
}

module.exports = sequenceLogout;
