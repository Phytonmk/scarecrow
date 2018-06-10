process.env["NTBA_FIX_319"] = 1;
module.exports = (configs={}) => {
  require(__dirname + '/bin/init/request-proxy')(configs);
  let useClusters = true
  if (!configs.webhooks)
    useClusters = false;
  if (!configs.workers)
    useClusters = false;
  else if (configs.workers.max < 2)
    useClusters = false;
  if (!useClusters) {
    return require(__dirname + '/bin/master.js')(configs, useClusters);
  } else {
    const cluser = require('cluster');
    if (cluser.isMaster)
      require(__dirname + '/bin/master.js')(configs, useClusters);
    else
      require(__dirname + '/bin/worker.js')(configs);
  }
}