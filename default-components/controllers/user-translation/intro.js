module.exports = (ctx, user, app) => {
  const keyboard = [];
  if (app.langs === 1) {
    keyboard.push([{
      text: user.texts['download-lang'].replace('{{lang}}', app.langs[0].toUpperCase()),
      callback_data: 'download-lang-file:' + app.langs[0]
    }]);
  } else {
    if (app.configs.languages.main !== 'en') {
      keyboard.push([{
        text: user.texts['download-lang'].replace('{{lang}}', app.langs[0].toUpperCase()),
        callback_data: 'download-lang-file:' + app.langs[0]
      }]);
    }
    keyboard.push([{
      text: user.texts['download-lang'].replace('{{lang}}', 'EN'),
      callback_data: 'download-lang-file:en'
    }]);
  }
  keyboard.push([{
    text: user.texts['send-translation'],
    callback_data: 'send-translation'
  }]);
  keyboard.push([{
    text: user.texts['valid-translation-file-rules-btn'],
    callback_data: 'valid-translation-file-rules'
  }]);
  let introText = user.texts['user-translations-intro'];
  if (keyboard.length > 1 && app.langs.some(lang => lang === 'en'))
    introText += '\n' + user.texts['user-translations-main-language'].replace('{{lang}}', app.langs[0].toUpperCase());
  app.tg.sendMessage(user.id, introText, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
}