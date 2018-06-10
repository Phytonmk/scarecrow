const mongoose = require('mongoose');
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
        await user.save();
      } else {
        user = userMatch;
      }
      resolve(user);
    } catch(e) {
      console.log(e);
      reject(e);
    }
  });
}