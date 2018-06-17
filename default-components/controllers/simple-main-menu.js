module.exports = (ctx, user, app) => {
  user.setState('');
  app.tg.sendMessage(user.id, 'Default main menu', {reply_markup: {remove_keyboard: true}});
};