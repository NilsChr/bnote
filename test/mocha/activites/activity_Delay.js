/**
 * 
 * @param {int} duration Duration in milliseconds
 */
function Delay(duration) {
    return new Promise(function(resolve) {
        setTimeout(resolve, duration);
      })
        .catch()
        .finally();
}

module.exports = Delay;