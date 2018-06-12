module.exports = (router, controllers, Subrouter) => {
  const c = controllers;
  router.default(c.default);
  router.text(/hi|hello/i, c.hi);
  router.text('/ping', c.ping);
  router.photo(c.images.forwarder); 
  // router.image('Some caption', c.images.captionEditor);
  const adminOnly = new Subrouter(); 
  router.access(10, adminOnly);
    adminOnly.text('Password', c.secretCode)
}