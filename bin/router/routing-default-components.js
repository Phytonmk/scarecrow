module.exports = (router, app, Subrouter) => {
  const c = app.controllers;
  if (router.defaultController === null)
    router.default(c['simple-main-menu']);
  router.text('/feedback', c['default-feedback'].init);
  router.state('feedback-typing')
    .text(c['default-feedback'].send);
  router.access(10)
    .callback_query(/^(answer\-feedback)\:[0-9]{1,}$/, c['default-feedback'].adminInit)
    .state('feedback-typing')
      .text(c['default-feedback'].adminAnswer);
  router.text((ctx, user, app) => /^(\/start)/.test(ctx.text) || ctx.text === '/lang', c['languages-switcher'].init);
  router.callback_query(/^(set-language:).{1,}$/, c['languages-switcher'].set);
};