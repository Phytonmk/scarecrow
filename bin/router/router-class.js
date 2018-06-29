const events = require(__dirname + '/events.json');
class Router {
  constructor(configs) {
    this.routes = {};
    this.statesRoutes = {};
    this.accessLayers = [];
    this.defaultController = null;
    for (let event of events.common) {
      this[event] = (a, b) => {
        let condition, controller;
        if (b !== undefined) {
          condition = a;
          controller = b;
        } else if (typeof a === 'function') {
          condition = null;
          controller = a;
        } else {
          condition = a;
          controller = new Router();
        }
        const route = (ctx, user, app) => {
          return new Promise((resolve, reject) => {
            let compare = null;
            if (ctx.text !== undefined)
              compare = ctx.text;
            else if (ctx.caption !== undefined)
              compare = ctx.caption;
            else if (ctx.data !== undefined)
              compare = ctx.data;
            // console.log(compare, condition);
            try {
              if (compare === null || condition === null)
                resolve(controller);
              else if (condition instanceof RegExp && condition.test(compare))
                resolve(controller);
              else if (typeof condition === 'function') {
                if (condition.length === 3 && condition(ctx, user, app))
                  resolve(controller);
                else if (condition.length === 5)
                  condition(ctx, user, app, () => {resolve(controller)}, () => {resolve(false)});
                else
                  resolve(false);
              } else if (condition === compare) {
                resolve(controller);
              } else {
                resolve(false);
              }
            } catch (e) {reject(e)}
          });
        };
        if (typeof this.routes[event] === 'undefined')
          this.routes[event] = [route];
        else
          this.routes[event].push(route);
        return this;
      };
    }
  }
  access(level, controller) {
    if (controller === undefined)
      controller = new Router();
    if (typeof this.accessLayers[level] === 'undefined')
      this.accessLayers[level] = [controller];
    else
      this.accessLayers[level].push(controller);
    return controller;
  }
  reply(controller) {
    if (controller === undefined)
      controller = new Router();
    if (typeof this.reply_routes === 'undefined')
      this.reply_routes = [controller];
    else
      this.reply_routes.push(controller);
    return controller;
  }
  state(state, controller) {
    if (controller === undefined) {
      controller = new Router();
    }
    if (typeof this.statesRoutes[state] === 'undefined')
      this.statesRoutes[state] = [() => new Promise((resolve, reject) => resolve(controller))];
    else
      this.statesRoutes[state].push(() => new Promise((resolve, reject) => resolve(controller)));
    return controller;
  }
  default(controller) {
    this.defaultController = controller;
  }
}
module.exports = Router;