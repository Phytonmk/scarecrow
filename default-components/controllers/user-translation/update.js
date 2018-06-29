const axios = require('axios');
const fs = require('fs');
const yaml = require('js-yaml');

module.exports = async (ctx, user, app, logger) => {
  app.tg.answerCallbackQuery(ctx.id);
  const tgFile = await app.tg.getFile(ctx.data.split(':')[1]);
  const tgPath = tgFile.file_path;
  const url = 'https://api.telegram.org/file/bot' + app.configs.token + '/' + tgPath;
  const file = await axios.get(url).catch(() => logger.error('Cannot download user translation from telegram ' + filePath));
  let fileData;
  const error = (e) => {
    app.tg.sendMessage(user.id, user.texts['translation-file-not-updated']);
    logger.error(e);
  }

  try {
    fileData = yaml.safeLoad(file.data);
  } catch (e) {
    error(e);
  }

  if (!fileData)
    return;
  const fileName = fileData['language-full-title'].substr(0, 2).toLowerCase() + '.yaml';
  const filePath = app.configs.folders.texts + '/' + fileName;

  fs.writeFile(filePath + '.tmp', file.data, (err) => {
    
    if (err) {
      error(err);
      return;
    }
    
    fs.stat(filePath, (err, data) => {
      if (!err) {
        app.tg.sendDocument(user.id, filePath, {
          caption: user.texts['old-translation-file']
        })
          .then(rename)
          .catch(error);

      } else if (err.code === 'ENOENT') {
        rename();
      } else {
        error(err);
      }
    });

    const rename = () => {
      fs.rename(filePath + '.tmp', filePath, (err) => {
        if (err)
          logger.error(err);
        else
          app.tg.sendMessage(user.id, user.texts['translation-file-updated']);
      });
    }
  });
}