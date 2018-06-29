const fs = require('fs');
const axios = require('axios');
const yaml = require('js-yaml');
module.exports = async (ctx, user, app, logger) => {
  const tgFile = await app.tg.getFile(ctx.document.file_id);
  const filePath = tgFile.file_path;
  const url = 'https://api.telegram.org/file/bot' + app.configs.token + '/' + filePath;
  const file = await axios.get(url).catch(() => logger.error('Cannot download user translation from telegram ' + filePath));

  let data;
  try {
    data = yaml.safeLoad(file.data);
    if (!data['language-full-title'])
      throw 'err';
  } catch (e) {
    app.tg.sendMessage(user.id, user.texts['translation-file-invaild'] + '\n' + e);
    return;
  }

  await user.setState('');
  app.tg.sendMessage(user.id, user.texts['translation-file-send'], {reply_markup: {remove_keyboard: true}});
  const Admin = app.models.User;
  
  const admins = await Admin
    .find({})
    .sort({access: -1})
    .limit(1);

  const forwardedMessage = await app.tg.forwardMessage(admins[0].id, user.id, ctx.message_id, {});
  app.tg.sendMessage(admins[0].id, user.texts['new-translation-file'].replace('{{lang}}', data['language-full-title']), {
    parse_mode: 'Markdown',
    reply_to_message_id: forwardedMessage.message_id,
    reply_markup: {
      inline_keyboard: [[{
        text: user.texts['accept'],
        callback_data: 'update-translation-file-confirm:' + ctx.document.file_id 
      }/*, {
        text: user.texts['delete'],
        callback_data: 'remove-with-msg:confirm'
      }*/]]
    }
  });

}