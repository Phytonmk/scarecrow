
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
        if (!e)
          logger.warning(`Unhandeled rout for user \n${JSON.stringify(user, null, 2)}, for event \n${JSON.stringify(event, null, 2)}`);
        else
          logger.error(e);
      });
  };
  require(__dirname + '/aggregator')(app.tgApi, routEvent, logger.error);
};

const resolveRout = (router, event, user, Router, app) => {
  return new Promise(async (resolve, reject) => {
    const topAccessLevelRoutes = iterateAccessLevels(router, user);
    for (let controller of topAccessLevelRoutes) {
      try {
        controller.parentRouter = router;
        resolve(await resolveRout(controller, event, user, Router, app));
        return;
      } catch (e) {
        reject(e);
      }
    }
    if (user.state) {
      tryRoute(router, router.statesRoutes[user.state], event, user, Router, app, resolve, reject)
        .then(res => resolve(res))
        .catch(e => reject(e));
    }
    tryRoute(router, router.routes[event.event], event, user, Router, app, resolve, reject)
      .then(res => resolve(res))
      .catch(e => reject(e));
  });
};

const tryRoute = (router, route, event, user, Router, app) => new Promise (async (resolve, reject) => {
  
  try {
    const controller = await iterateRouter(route, event, user, app);
    if (controller instanceof Router) {
      controller.parentRouter = router;
      resolveRout(controller, event, user, Router, app);
    } else {
      try {
        controller(event.ctx, user, app);
      } catch(e) {
        reject(e);
      }
      resolve();
    }
    return;
  } catch(e) {
    popUpForDefaultController(router, reject, event, user, app);
  }
});

const popUpForDefaultController = (router, reject, event, user, app) => {
  if (router.defaultController !== null)
    router.defaultController(event.ctx, user, app);
  else if (typeof router.parentRouter !== 'undefined')
    popUpForDefaultController(router.parentRouter, reject, event, user, app);
  else
    reject(false);
};

const iterateAccessLevels = (router, user) => {
  let availableRoutes = [];
  for (let i = user.access; i >= 0; i--) {
    if (typeof router.accessLayers[i] !== 'undefined') {
      availableRoutes = [...router.accessLayers[i], ...availableRoutes];
    }
  }
  return availableRoutes;
};

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
};

