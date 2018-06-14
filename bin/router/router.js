
module.exports = (app) => {
  const logger = require(__dirname + '/../logger')(app.configs);
  const Router = require(__dirname + '/router-class');
  const router = new Router();
  require(app.configs.router)(router, app.controllers, Router);
  require(__dirname + '/routing-defult-components')(router, app);
  const routEvent = async (event) => {
    if (typeof app.requests[event.ctx.from.id] === 'undefined') {
      event.received = new Date().getTime();
      app.requests[event.ctx.from.id] = event.received;
    }
    const user = await require(__dirname + '/user-data')(app, event.ctx);
    resolveRout(router, event, user, Router, app)
      .catch((e) => {
        logger.error(e);
        if (!e)
          logger.warning(`Unhandeled rout for user \n${JSON.stringify(user, null, 2)}, for event \n${JSON.stringify(event, null, 2)}`);
      });
  };
  require(__dirname + '/aggregator')(app.tgApi, routEvent, logger.error);
}

const resolveRout = (router, event, user, Router, app) => {
  return new Promise(async (resolve, reject) => {
    const topAccessLevelRoutes = iterateAccessLevels(router, user);
    for (let controller of topAccessLevelRoutes) {
      try {
        await resolveRout(controller, event, user, Router, app);
        return;
      } catch (e) {}
    }
    if (user.state) {
      try {
        const controller = await iterateRouter(router.statesRoutes[user.state], event, user, app);
        if (controller instanceof Router) {
          resolveRout(controller, event, user, Router, app);
        } else {
          try {
            controller(event.ctx, user, app);
          } catch(e) {
            reject(e)
          }
          resolve();
        }
        return;
      } catch(e) {
        if (router.defaultController !== null)
          router.defaultController(event.ctx, user, app);
        else
          reject(false);
      }
    }
    try {
      const controller = await iterateRouter(router.routes[event.event], event, user, app);
      if (controller instanceof Router) {
        resolveRout(controller, event, user, Router, app);
      } else {
        try {
          controller(event.ctx, user, app);
        } catch(e) {
          reject(e)
        }
        resolve();
      }
      return;
    } catch(e) {
      if (router.defaultController !== null)
        router.defaultController(event.ctx, user, app);
      else
        reject(false);
    }
  });
}

const iterateAccessLevels = (router, user) => {
  let availableRoutes = [];
  for (let i = user.access; i >= 0; i--) {
    if (typeof router.accessLayers[i] !== 'undefined') {
      availableRoutes = [...router.accessLayers[i], ...availableRoutes];
    }
  }
  return availableRoutes;
}

const iterateRouter = (routerLeyer, event, user, app) => {
  return new Promise(async (resolve, reject) => {
    let unhandeledRout = true;
    if (typeof routerLeyer === 'undefined') {
      reject();
      return;
    }
    for(let rout of routerLeyer/*router.routes[event.event]*/) {
      const controller = await rout(event.ctx, user, app);
      if (!controller)
        continue;
      // controller(event.ctx, user, app);
      resolve(controller);
      unhandeledRout = false;
      break;
    }
    if (unhandeledRout)
      reject();
  });
}