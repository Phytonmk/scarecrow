const onPage = 10;

const search = (model, userQuery, offset, limit, setAccessLevel) => new Promise(async (resolve, reject) => {
  let User = model;
  const searchQuery = 
  { $or: [
    { username: new RegExp(userQuery, 'i') },
    { first_name: new RegExp(userQuery, 'i') },
    { last_name: new RegExp(userQuery, 'i') },
    { id: /[^0-9]/.test(userQuery) ? 0 : new RegExp(userQuery, 'i') }
  ]}
  const users = await User.find(searchQuery).skip(offset).limit(limit).catch(reject);

  const usersAmount = await User.count(searchQuery).catch(reject);

  const usersList = [];
  for (let user of users)
    usersList.push({
      text: '[' + user.access + '] ' +
        (user.username ? '@' + user.username + ' ' : '') +
        user.first_name + (user.last_name ? ' ' + user.last_name : ''),
      callback_data: `set-user-access:${setAccessLevel}:${user.id}` 
    });
  resolve({usersList, usersAmount});
}); 

module.exports = {
  search: async (ctx, user, app) => {
    if (/^\/{1}[a-zA-Z]+\s{1}[0-9]+\s{1}.+/.test(ctx.text)) {
      let userQuery = ctx.text.replace(/\/[a-z_]{1,}\s{1}[0-9]{1,}\s{1}/i, '');
      userQuery = userQuery.replace(/@/g, '');
      let level = ctx.text.replace(/^\/[a-zA-Z]+\s{1}/, '').replace(/\s{1}.*$/, '') * 1;
      
      const users = await search(app.models.User, userQuery, 0, onPage, level);
      app.tg.sendMessage(user.id, user.texts['set-access-for'].replace('{{access}}', level), {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: app.helpers.catalog(users.usersList, 0, users.usersAmount, onPage, {
            // left: `set-user-access-catalog:${level}:${userQuery}:0`,
            right: `set-user-access-catalog:${level}:${userQuery}:${onPage}`
          }).keyboard
        }
      });
    } else {
      app.tg.sendMessage(user.id, user.texts['invalid-syntaxis'])
    }
  },
  catalog: async (ctx, user, app) => {

    app.tg.answerCallbackQuery(ctx.id);

    const level = ctx.data.split(':')[1] * 1;
    const userQuery = ctx.data.split(':')[2];
    const offset = ctx.data.split(':')[3] * 1;

    const users = await search(app.models.User, userQuery, offset, onPage, level);
    const catalog = app.helpers.catalog(users.usersList, offset, users.usersAmount, onPage, {
        left: `set-user-access-catalog:${level}:${userQuery}:${offset - onPage}`,
        right: `set-user-access-catalog:${level}:${userQuery}:${offset + onPage}`
      });
    app.tg.editMessageReplyMarkup({inline_keyboard: catalog.keyboard}, {
      chat_id: user.id,
      message_id: ctx.message.message_id
    });

  },
  set: async (ctx, user, app) => {
    app.tg.answerCallbackQuery(ctx.id);

    const level = ctx.data.split(':')[1] * 1;
    const processingUserId = ctx.data.split(':')[2] * 1;

    const processingUser = await app.models.User.findOne({id: processingUserId});

    const processingUserName = (processingUser.username ? '@' + processingUser.username + ' ' : '') +
        processingUser.first_name + (processingUser.last_name ? ' ' + processingUser.last_name : '');

    if (user.access > level && processingUser.access < user.access) {
      await app.models.User.update({id: processingUserId}, {access: level});      
      app.tg.sendMessage(user.id, user.texts['access-level-updated'].replace('{{user}}', processingUserName).replace('{{level}}', level))
    } else {
      app.tg.sendMessage(user.id, user.texts['unable-update-access'], {
        parse_mode: 'Markdown'
      })
    }
  }
}