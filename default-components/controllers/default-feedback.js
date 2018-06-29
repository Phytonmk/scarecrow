module.exports = {
  init: async (ctx, user, app) => {
    const texts = app.texts[user.lang];
    await app.tg.sendChatAction(user.id, 'typing');
    await user.setState('feedback-typing');
    app.tg.sendMessage(user.id, texts['feedback-title'], {
      reply_markup: {
        keyboard: [[texts.cancel]],
        resize_keyboard: true,
        one_time_keyboard: true
      },
      parse_mode: 'Markdown'
    });
  },
  send: async (ctx, user, app, logger) => {
    const texts = app.texts[user.lang];
    if (ctx.text === texts.cancel) {
      const res = await user.setState('');
      await app.tg.sendMessage(user.id, texts.canceled, {
        reply_markup: {
          remove_keyboard: true
        }
      });
    } else {
      await user.setState('');
      const Admin = app.models.User;
      const admins = await Admin
        .find({})
        .sort({access: -1})
        .limit(1);
      const forwardedMessage = await app.tg.forwardMessage(admins[0].id, user.id, ctx.message_id);
      await app.tg.sendMessage(admins[0].id, texts['new-feedback'], {
        parse_mode: 'Markdown',
        reply_to_message_id: forwardedMessage.message_id,
        reply_markup: {
          inline_keyboard: [[{
            text: texts['answer-feedback'],
            callback_data: 'answer-feedback:' + forwardedMessage.message_id
          }]]
        }
      });
      await app.tg.sendMessage(user.id, texts['feedback-result']);

      const feedback = new app.models.FeedbackMessage({
        from: user.id,
        admin: admins[0].id,
        userside_message_id: ctx.message_id,
        message_id: forwardedMessage.message_id,
        answer_typing: false
      });
      await feedback.save();
    }
  },
  adminInit: async (ctx, user, app) => {
    const texts = app.texts[user.lang];
    app.tg.answerCallbackQuery(ctx.id);
    await app.tg.sendChatAction(user.id, 'typing');
    
    const Feedback = app.models.FeedbackMessage;
    const feedback = await Feedback.findOne({admin: user.id, message_id: ctx.data.split(':')[1]});
    
    if (feedback === null) {
      await app.tg.sendMessage(user.id, texts['message-not-found']);
      return;
    }

    await Feedback.update({admin: user.id, message_id: ctx.data.split(':')[1]}, {$set: {answer_typing: true}}); 
    await user.setState('feedback-typing');
    await app.tg.sendMessage(user.id, texts['write-feedback-answer'], {
      reply_markup: {
        keyboard: [[texts.cancel]],
        resize_keyboard: true,
        one_time_keyboard: true
      },
      parse_mode: 'Markdown'
    });
  },
  adminAnswer: async (ctx, user, app, logger) => {
    const texts = app.texts[user.lang];
    
    if (ctx.text === texts.cancel) {
      const res = await user.setState('');
      await app.tg.sendMessage(user.id, texts.canceled, {
        reply_markup: {
          remove_keyboard: true
        }
      });
    } else {
      const Feedback = app.models.FeedbackMessage;
      const feedback = await Feedback.findOne({admin: user.id, answer_typing: true});
      
      if (feedback === null) {
        await app.tg.sendMessage(user.id, texts['message-not-found']);
        return;
      }

      await user.setState('');
      
      await app.tg.sendMessage(feedback.from, texts['you-have-an-answer'] + '\n' + ctx.text, {
        reply_to_message_id: feedback.userside_message_id
      });
      await app.tg.sendMessage(user.id, texts['feedback-result'], {
        remove_keyboard: true
      });

      await Feedback.findOneAndRemove({admin: user.id, answer_typing: true});
    }
  }
};