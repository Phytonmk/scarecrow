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
        } else {
          condition = null;
          controller = a;
        }
        const route = (ctx, user, app) => {
          return new Promise((resolve, reject) => {
            let compare = null;
            if (ctx.text !== undefined)
              compare = ctx.text;
            else if (ctx.caption !== undefined)
              compare = ctx.caption;
            else if (ctx.query !== undefined)
              compare = ctx.query;
            if (compare === null || condition === null)
              resolve(controller);
            else if (condition instanceof RegExp && condition.test(compare))
              resolve(controller);
            else if (typeof condition === 'function') {
              if (condition.length === 3 && condition(ctx, user, app))
                resolve(controller);
              else if (condition.length === 5)
                condition(ctx, user, app, () => {resolve(controller)}, () => {resolve(false)});
            } else if (condition === compare) {
              resolve(controller);
            } else {
              resolve(false);
            }
          });
        };
        if (typeof this.routes[event] === 'undefined')
          this.routes[event] = [route];
        else
          this.routes[event].push(route);
      }
    }
  }
  access(level, controller) {
    if (typeof this.accessLayers[level] === 'undefined')
      this.accessLayers[level] = [controller];
    else
      this.accessLayers[level].push(controller);
  }
  state(state, controller) {
    if (typeof this.statesRoutes[state] === 'undefined')
      this.statesRoutes[state] = [controller];
    else
      this.statesRoutes[state].push(controller);
  }
  default(controller) {
    this.defaultController = controller;
  }
}
module.exports = Router;