module.exports = (ctx, user, app) => {
  app.tg.sendMessage(user.id, '123456');
}