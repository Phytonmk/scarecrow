module.exports = (ctx, user, app) => {
  app.tg.answerCallbackQuery(ctx.id);
  app.tg.sendMessage(user.id, user.texts['valid-translation-file-rules'], {
    parse_mode: 'Markdown'
  });
}