module.exports = (ctx, user, app) => {
  app.tg.deleteMessage(user.id, ctx.message.message_id);
}