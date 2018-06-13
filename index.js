process.env["NTBA_FIX_319"] = 1;
if (module.parent === null) {
  for(let i in [0,0,0,0]) console.log('\n');
  console.log('-------------------------------------------')
  console.log('|Use this module via require(\'scarecrow\');|')
  console.log('-------------------------------------------')
  for(let i in [0,0,0,0]) console.log('\n');
}
module.exports = (configs={}) => {
  require(__dirname + '/bin/init/request-proxy')(configs);
  let useClusters = true
  if (!configs.webhooks)
    useClusters = false;
  if (!configs.workers)
    useClusters = false;
  else if (configs.workers.max < 2)
    useClusters = false;
  configs.useClusters = useClusters;
  if (!configs.useClusters) {
    return require(__dirname + '/bin/master.js')(configs);
  } else {
    const cluser = require('cluster');
    if (cluser.isMaster)
      require(__dirname + '/bin/master.js')(configs);
    else
      require(__dirname + '/bin/worker.js')(configs);
  }
}