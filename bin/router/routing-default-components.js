module.exports = (router, app, Subrouter) => {
  const c = app.controllers;
  
  router
    .callback_query(/^(remove\-msg)$/, c['remove-msg'])

  if (router.defaultController === null)
    router.default(c['simple-main-menu']);
  router
    .text('/feedback', c['default-feedback'].init)
    .state('feedback-typing')
      .text(c['default-feedback'].send);
  
  router.access(10)
    .callback_query(/^(answer\-feedback)\:[0-9]+$/, c['default-feedback'].adminInit)
    .state('feedback-typing')
      .text(c['default-feedback'].adminAnswer);
  
  router
    .text((ctx, user, app) => /^(\/start)/.test(ctx.text) || ctx.text === '/lang', c['languages-switcher'].init)
    .callback_query(/^(set-language:).+$/, c['languages-switcher'].set);
  
  router
    .text('/translate', c['user-translation'].intro)
    .callback_query('user-translation', c['user-translation'].intro)
    .callback_query(/^(download\-lang\-file\:)[a-zA-Z]{1,5}$/, c['user-translation'].download)
    .text('/sendTranslation', c['user-translation']['file-await'])
    .callback_query('send-translation', c['user-translation']['file-await'])
    .callback_query('valid-translation-file-rules', c['user-translation']['rules'])
    .state('translation-file-waiting')
      .document(c['user-translation']['check'])
      .text(c['user-translation']['file-await']);
  router
    .access(10)
      .callback_query(/^(update\-translation\-file\-confirm\:)/, c['user-translation']['confirm'])
      .callback_query(/^(update\-translation\-file\:)/, c['user-translation']['update']);

  router
    .access(8)
      .text(/^(\/setAccess){1}.+/, c['set-access'].search)
      .callback_query(/set\-user\-access\-catalog\:[0-9]+\:.*\:[0-9]+/, c['set-access'].catalog)
      .callback_query(/set\-user\-access:[0-9]+:[0-9]+/, c['set-access'].set);
};