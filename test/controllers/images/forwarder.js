module.exports = (ctx, user, app) => {
  app.tg.sendMessage(user.id, 'Image forwarded to admin 😌');
  app.tg.forwardMessage(156646228, user.id, ctx.message_id);
}