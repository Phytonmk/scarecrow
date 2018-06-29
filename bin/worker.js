module.exports = (configs, masterApp=null) => {
  const logger = require(__dirname + '/logger')(configs);
  const app = masterApp !== null ? masterApp : require(__dirname + '/init/app')(configs);
  // global.app = app;
  require(__dirname + '/init/database')(app);
  require(__dirname + '/https-server')(app);
  require(__dirname + '/init/texts')(app)
    .then(() => {
      try {
        require(__dirname + '/init/components')(app, ['controllers', 'helpers', 'models']);
        require(__dirname + '/init/statistics')(app);
        require(__dirname + '/router/router')(app);
      } catch (e) {
        console.log(e);
        logger.error('Some component error ' + e);
      }
    })
    .catch(e => {
      logger.error('Cannot load languages texts ' + e);
    });
};