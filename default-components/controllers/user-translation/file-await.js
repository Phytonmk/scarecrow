module.exports = async (ctx, user, app) => {
  if (ctx.id)
    app.tg.answerCallbackQuery(ctx.id);
  if (ctx.text === user.texts.cancel) {
    await user.setState('');
    app.tg.sendMessage(user.id, user.texts.canceled, {reply_markup: {remove_keyboard: true}});
  } else {
    await user.setState('translation-file-waiting');
    app.tg.sendMessage(user.id, user.texts['translation-file-waiting'], {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [[user.texts.cancel]],
        resize_keyboard: true
      }
    });
  }
}