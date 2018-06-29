module.exports = async (ctx, user, app) => {
  app.tg.sendMessage(user.id, 'pong');
  await app.stats.inc('ping');
};