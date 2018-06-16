module.exports = (router, app) => {
  const c = app.controllers;
  if (router.defaultController === null)
    router.default(c['simple-main-menu']);
  router.text((ctx, user, app) => /^(\/start)/.test(ctx.text) || ctx.text === '/lang', c['languages-switcher'].init);
  router.callback_query(/^(set-language:).{1,}$/, c['languages-switcher'].set);
  // router.text('/lang', c['languages-switcher']);
};