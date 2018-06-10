const tgApi = require('node-telegram-bot-api');
module.exports = (configs) => {
  const logger = require(__dirname + '/logger')(configs);
  const app = {configs};

  app.tg = new tgApi(configs.token, {
    polling: !configs.webhooks,
    request: {proxy: configs.requestProxyString}
  });

  require(__dirname + '/https-server')(app);
  require(__dirname + '/init/database')(app);

  require(__dirname + '/init/components')(app, ['controllers', 'helpers', 'models']);
  const initValueOfModelsFolder = app.configs.folders.models;
  app.configs.folders.models = __dirname + '/../models';
  require(__dirname + '/init/components')(app, ['models']);
  app.configs.folders.models = initValueOfModelsFolder;
  require(__dirname + '/router/router')(app);
}