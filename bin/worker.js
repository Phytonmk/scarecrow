module.exports = (configs, masterApp=null) => {
  const logger = require(__dirname + '/logger')(configs);
  const app = masterApp !== null ? masterApp : require(__dirname + '/init/app')(configs);

  require(__dirname + '/init/database')(app);
  require(__dirname + '/https-server')(app);
  
  require(__dirname + '/init/textes')(app).catch(e => {
    logger.error('Cannot load languages textes ' + e);
  });

  require(__dirname + '/init/components')(app, ['controllers', 'helpers', 'models']);
  const initValueOfModelsFolder = app.configs.folders.models;
  app.configs.folders.models = __dirname + '/../models';
  require(__dirname + '/init/components')(app, ['models']);
  app.configs.folders.models = initValueOfModelsFolder;
  require(__dirname + '/router/router')(app);
  console.log(app.textes);
}