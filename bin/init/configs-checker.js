const fs = require('fs');
module.exports = (configs) => {
  if (!configs.folders)
    throwErr('No folders property');
  for (let folder in configs.folders) {
    if (!fs.existsSync(configs.folders[folder]))
      throwErr(configs.folders[folder] + ' not exists');
  }
  if (!configs.languages)
    throwErr('No languages property');
  if (!configs.database)
    throwErr('No database property');
  if (!configs.token)
    throwErr('No token property');
  if (configs.webhooks && !configs.workers)
    throwErr('No workers property when webhooks property is');
  if (!configs.router)
    throwErr('No router property');
  if (!fs.existsSync(configs.router))
      throwErr(configs.router + ' not exists');
  if (typeof configs.autoexit !== 'number')
    throwErr('Autoexit property is not a number');
};
const throwErr = (err) => {
  console.log('Unable to start: wrong configs');
  console.log(err);
  process.exit(1);
};