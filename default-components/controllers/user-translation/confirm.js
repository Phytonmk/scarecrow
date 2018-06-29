module.exports = (ctx, user, app) => {
  app.tg.answerCallbackQuery(ctx.id);
  app.tg.sendMessage(user.id, user.texts['sure'], {
    reply_markup: {
      inline_keyboard: [[{
        text: user.texts.accept,
        callback_data: ctx.data.replace('-confirm', '')
      }, {
        text: user.texts.decline,
        callback_data: 'remove-msg'
      }]]
    }
  })
}