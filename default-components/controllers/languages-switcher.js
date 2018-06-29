module.exports = {
  init: (ctx, user, app) => {
    let texts = app.texts[user.lang];
    const languageButtons = [];
    for (let lang of app.langs) {
      languageButtons.push({
        text: app.texts[lang]['language-full-title'] !== app.texts[app.configs.languages.main]['language-full-title'] ||
          lang === app.configs.languages.main ?
          app.texts[lang]['language-full-title'] : lang,
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
    app.tg.sendMessage(user.id, texts['select-language'], {
      reply_markup: {inline_keyboard: keyboard},
    });
  },
  set: (ctx, user, app) => {
    app.tg.answerCallbackQuery(ctx.id);
    const newLang = ctx.data.substr(13);
    if (typeof app.texts[newLang] !== 'undefined') {
      user.lang = newLang;
      user.save();
      app.tg.editMessageText(app.texts[newLang]['language-updated'].replace('{{lang-name}}', app.texts[newLang]['language-full-title']),
        {chat_id: ctx.message.chat.id, message_id: ctx.message.message_id});
    }
  }
};