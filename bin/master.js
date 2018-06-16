module.exports = (configs) => {
  const logger = require(__dirname + '/logger')(configs);
  // logger.info('Bot started');
  const app = require(__dirname + '/init/app')(configs);
  require(__dirname + '/init/database')(app);
  require(__dirname + '/init/webhooks')(configs);
  require(__dirname + '/init/textes')(app).catch(e => {
    logger.error('Cannot load languages textes ' + e);
  });
  require(__dirname + '/init/components')(app, ['intervals', 'helper'], configs.folders);
  if (!configs.useClusters)
    require(__dirname + '/worker')(configs, app);
};