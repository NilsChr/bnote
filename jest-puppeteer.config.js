// jest-puppeteer.config.js
module.exports = {
  /*server: {
    command: "npm run serve",
    port: 6666,
    launchTimeout: 30000,
  },*/
  /*
  server: {
    command: "vue-cli-service serve",
    port: 8,
    launchTimeout: 30000
  },*/
  launch: {
    dumpio: true,
    headless:false,
    args: ['--start-maximized'],
  },
  browser: "chromium",
  browserContext: "default",
  
};
