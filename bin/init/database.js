const mongoose = require('mongoose');
module.exports = (app) => {
  const logger = require(__dirname + '/../logger')(app.configs);
  mongoose.connect(app.configs.database).catch((e) => {logger.error('DB connection error:' + e)});
}