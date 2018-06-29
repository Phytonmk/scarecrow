const fs = require('fs');
module.exports = (ctx, user, app, logger) => {
  app.tg.answerCallbackQuery(ctx.id);
  app.tg.sendChatAction(user.id, 'upload_document');
  app.tg.sendDocument(user.id, app.configs.folders.texts + '/' + ctx.data.split(':')[1] + '.yaml')
    .catch(logger.error);
}