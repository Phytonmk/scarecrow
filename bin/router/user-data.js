module.exports = (app, ctx) => {
  return new Promise(async (resolve, reject) => {
    try {
      const User = app.models.User;
      const userMatch = await User.findOne({id: ctx.from.id}).catch(e => console.log(e));
      let user;
      if (userMatch === null) {
        user = new User();
        user.id = ctx.from.id;
        user.first_name = ctx.from.first_name;
        if (ctx.from.last_name)
          user.last_name = ctx.from.last_name;
        else
          user.last_name = '';
        if (ctx.from.username)
          user.username = ctx.from.username;
        else
          user.username = '';
        if (app.configs.languages && app.configs.languages.main)
          user.lang = app.configs.languages.main;
        if (ctx.text && /^(\/start)\s.{1,}$/i.test(ctx.text))
          user.start_string = ctx.text.substr(7);
        await user.save();
      } else {
        user = userMatch;
      }
      user.texts = app.texts[user.lang];
      user.setState = (state) => User.update({_id: user._id}, {$set: {state}});
      resolve(user);
    } catch(e) {
      console.log(e);
      reject(e);
    }
  });
};