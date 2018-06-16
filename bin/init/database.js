const mongoose = require('mongoose');
module.exports = (app) => {
  if (typeof app.mongo === 'undefined') {
    app.mongo = 'connecting';
    const logger = require(__dirname + '/../logger')(app.configs);
    mongoose.connect(app.configs.database)
      .then(() => app.mongo = 'connected')
      .catch((e) => logger.error('DB connection error:' + e));
  }
};