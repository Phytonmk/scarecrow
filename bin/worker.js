module.exports = (configs, masterApp=null) => {
  const logger = require(__dirname + '/logger')(configs);
  const app = masterApp !== null ? masterApp : require(__dirname + '/init/app')(configs);
  require(__dirname + '/init/database')(app);
  require(__dirname + '/https-server')(app);
  
  require(__dirname + '/init/textes')(app)
    .then(() => {
      require(__dirname + '/init/components')(app, ['controllers', 'helpers', 'models']);
      const initValueOfFolder = Object.assign({}, app.configs.folders);
      app.configs.folders = {
        'models': __dirname + '/../default-components/models',
        'controllers': __dirname + '/../default-components/controllers',
        'textes': __dirname + '/../default-components/textes',
      };
      require(__dirname + '/init/components')(app, ['models', 'controllers']);
      app.configs.folders.models = initValueOfFolder;
      require(__dirname + '/router/router')(app);
    })
    .catch(e => {
      logger.error('Cannot load languages textes ' + e);
    });
};