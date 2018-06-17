module.exports = (ctx, user, app) => {
  user.setState('');
  const textes = app.textes[user.lang];
  app.tg.sendMessage(user.id, textes.canceled, {reply_markup: {remove_keyboard: true}});
};