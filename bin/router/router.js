
module.exports = (app) => {
  const logger = require(__dirname + '/../logger')(app.configs);
  const Router = require(__dirname + '/router-class');
  const router = new Router();
  const resolveRout = require(__dirname + '/resolve-rout');
  require(app.configs.router)(router, app.controllers, Router);
  require(__dirname + '/routing-default-components')(router, app, Router);
  const routEvent = async (event) => {
    let incommingId = null;
    if (event.ctx.chat)
      incommingId = event.ctx.chat.id;
    else if (event.ctx.message)
      incommingId = event.ctx.message.chat.id;
    if (incommingId !== null && typeof app.requests[incommingId] === 'undefined') {
      event.received = new Date().getTime();
      app.requests[incommingId] = event.received;
    }
    const user = await require(__dirname + '/user-data')(app, event.ctx);
    resolveRout(router, event, user, Router, app, logger)
      .catch((e) => {
        if (!e)
          logger.warning(`Unhandeled rout for user \n${JSON.stringify(user, null, 2)}, for event \n${JSON.stringify(event, null, 2)}`);
        else
          logger.error(e);
      });
  };
  require(__dirname + '/aggregator')(app.tgApi, routEvent, logger.error);
};

