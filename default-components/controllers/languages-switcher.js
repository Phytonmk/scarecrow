module.exports = {
  init: (ctx, user, app) => {
    let textes = app.textes[user.lang];
    const languageButtons = [];
    for (let lang of app.langs) {
      languageButtons.push({
        text: app.textes[lang]['language-full-title'] !== app.textes[app.configs.languages.main]['language-full-title'] ||
          lang === app.configs.languages.main ?
          app.textes[lang]['language-full-title'] : lang,
        callback_data: 'set-language:' + lang
      });
    }
    const keyboard = [];
    while(languageButtons.length > 0) {
      if (languageButtons.length > 1) {
        keyboard.push([languageButtons[0], languageButtons[1]]);
        languageButtons.shift();
        languageButtons.shift();
      } else {
        keyboard.push([languageButtons[0]]);
        languageButtons.shift();
      }
    }
    app.tg.sendMessage(user.id, textes['select-language'], {
      reply_markup: {inline_keyboard: keyboard},
    });
  },
  set: (ctx, user, app) => {
    app.tg.answerCallbackQuery(ctx.id);
    const newLang = ctx.data.substr(13);
    if (typeof app.textes[newLang] !== 'undefined') {
      user.lang = newLang;
      user.save();
      app.tg.editMessageText(app.textes[newLang]['language-updated'].replace('{{lang-name}}', app.textes[newLang]['language-full-title']),
        {chat_id: ctx.message.chat.id, message_id: ctx.message.message_id});
    }
  }
};