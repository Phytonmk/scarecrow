module.exports = (ctx, user, app) => {
  app.tg.sendMessage(user.id, '😛', {reply_markup: {remove_keyboard: true}});
};