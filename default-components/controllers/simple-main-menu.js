module.exports = (ctx, user, app) => {
  app.tg.sendMessage(user.id, 'Default main menu', {remove_keyboard: true});
};