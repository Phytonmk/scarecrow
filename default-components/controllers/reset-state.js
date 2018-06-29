module.exports = (ctx, user, app) => {
  user.setState('');
  const texts = app.texts[user.lang];
  app.tg.sendMessage(user.id, texts.canceled, {reply_markup: {remove_keyboard: true}});
};