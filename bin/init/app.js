const tgApi = require('node-telegram-bot-api');
module.exports = (configs) => {
  const app = {configs, requests: {}};
  app.tgApi = new tgApi(configs.token, {
    polling: !configs.useClusters,
    request: {proxy: configs.requestProxyString}
  });
  require(__dirname + '/../methods-proxier')(app);
  return app;
}