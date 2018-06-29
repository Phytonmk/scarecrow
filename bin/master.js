module.exports = (configs) => {
  const logger = require(__dirname + '/logger')(configs);
  // logger.info('Bot started');
  const app = require(__dirname + '/init/app')(configs);
  require(__dirname + '/init/database')(app);
  require(__dirname + '/init/webhooks')(configs);
  require(__dirname + '/init/texts')(app).catch(e => {
    logger.error('Cannot load languages texts ' + e);
  });
  require(__dirname + '/init/components')(app, ['intervals', 'helper', 'models']);
  require(__dirname + '/init/statistics')(app);

  if (!configs.useClusters)
    require(__dirname + '/worker')(configs, app);
};