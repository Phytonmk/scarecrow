module.exports = (ctx, user, app) => {
  app.tg.sendMessage(user.id, 'Hello ✌🏻');
}