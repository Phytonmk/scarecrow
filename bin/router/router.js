module.exports = (app) => {
  const logger = require(__dirname + '/../logger')(app.configs);
  const scheme = require(app.configs.router)(app.controllers);
  const routEvent = async (event) => {
    const user = await require(__dirname + '/user-data')(app, event.ctx);
    event.receive = new Date().getTime();
    const controller = require(__dirname + '/scheme-analyzer')(user, scheme, event);
    if (typeof controller === 'function')
      controller(user, event.ctx, app);
    else
      logger.warning(`Unhandeled rout for user \n${JSON.stringify(user, null, 2)}, for event \n${JSON.stringify(event, null, 2)}`);
  };
  require(__dirname + '/aggregator')(app.tg, routEvent)
}