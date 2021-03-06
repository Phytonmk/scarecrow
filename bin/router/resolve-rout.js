const resolveRout = (router, event, user, Router, app, logger) => {
  return new Promise(async (resolve, reject) => {
    // console.log(router);
    const topAccessLevelRoutes = iterateAccessLevels(router, user);
    for (let controller of topAccessLevelRoutes) {
      try {
        controller.parentRouter = router;
        const resolvedRout = await resolveRout(controller, event, user, Router, app, logger);
        if (resolvedRout) {
          resolve(resolvedRout);
          return;
        }
      } catch (e) {
        if (e)
          reject(e);
      }
    }
    try {
      if (user.state && router.statesRoutes[user.state]) {
        let userState = user.state
        user.TMP_STATE = userState;
        user.state = '';
        await tryRoute(router, router.statesRoutes[userState], event, user, Router, app, logger)
          .then(res => resolve(res))
          .catch(e => reject(e));
      } else if (router.reply_routes && event.ctx.reply_to_message) {
        for (let route of router.reply_routes)
          await tryRoute(router, route, event, user, Router, app, logger)
            .then(res => resolve(res))
            .catch(e => reject(e));
      } else if (router.routes[event.event]) {
        await tryRoute(router, router.routes[event.event], event, user, Router, app, logger)
          .then(res => resolve(res))
          .catch(e => reject(e));
      } else {
        tryDefaultController(router, event, user, app, logger)
          .then(resolve)
          .catch(reject);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const tryRoute = (router, route, event, user, Router, app, logger) => new Promise (async (resolve, reject) => {
  const controller = await iterateRouter(route, event, user, app).catch(reject);
  if (controller) {
    if (controller instanceof Router) {
      controller.parentRouter = router;
      resolveRout(controller, event, user, Router, app, logger)
        .then(resolve)
        .catch(reject);
    } else {
      try {
        if (typeof controller !== 'function') {
          reject('Controllers must be a function');
          return;
        }
        controller(event.ctx, user, app, logger);
        if (user.TMP_STATE) {
          user.state = user.TMP_STATE;
          delete user.TMP_STATE;
        }
      } catch(e) {
        reject(e);
      }
      resolve(true);
    }
    return;
  } else {
    tryDefaultController(router, event, user, app, logger)
      .then(resolve)
      .catch(reject);
    // popUpForDefaultController(router, resolve, reject, event, user, app);
  }
});

const tryDefaultController = (router, event, user, app, logger) => new Promise((resolve, reject) => {
  if (router.defaultController !== null) {
    try {
      router.defaultController(event.ctx, user, app, logger);
      if (user.TMP_STA) {
        user.state = user.TMP_STA;
        delete user.TMP_STA;
      }
    } catch (e) {
      reject(e);
    }
  } else {
    resolve(false);
  }
});

const popUpForDefaultController = (router, resolve, reject, event, user, app) => {
  if (router.defaultController !== null) {
    try {
      router.defaultController(event.ctx, user, app);
    } catch (e) {
      reject(e);
    }
  } else if (typeof router.parentRouter !== 'undefined') {
    popUpForDefaultController(router.parentRouter, resolve, reject, event, user, app);
  } else {
    resolve(false);
  }
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
      resolve(false);
      return;
    }
    for(let rout of routerLeyer/*router.routes[event.event]*/) {
      const controller = await rout(event.ctx, user, app)
        .catch(reject);
      if (!controller)
        continue;
      // controller(event.ctx, user, app);
      resolve(controller);
      unhandeledRout = false;
      break;
    }
    if (unhandeledRout)
      resolve(false);
  });
};

module.exports = resolveRout;