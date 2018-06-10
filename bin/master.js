module.exports = (configs, useClusters) => {
  const logger = require(__dirname + '/logger')(configs);
  // logger.info('Bot started');
  require(__dirname + '/init/webhooks')(configs);
  require(__dirname + '/init/components')({configs}, ['intervals'], configs.folders);
  if (!useClusters)
    require(__dirname + '/worker')(configs);
}