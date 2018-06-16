module.exports = (configs) => {
  if (configs.proxy.useProxy || typeof configs.proxy.useProxy === 'undefined') {
    configs.requestProxy = configs.proxy;
    delete configs.requestProxy.useProxy;
    if (typeof configs.proxy.auth !== 'undefined') {
      if (!configs.proxy.auth.username || !configs.proxy.auth.password) {
        delete configs.requestProxy.auth;
      }
    }
    let proxyString = '';
    if (typeof configs.requestProxy.auth !== 'undefined') {
      if (configs.requestProxy.auth.username)
        proxyString += configs.requestProxy.auth.username;
      if (configs.requestProxy.auth.password)
        proxyString += ':' + configs.requestProxy.auth.password;
      if (proxyString !== '')
        proxyString += '@';
    }
    proxyString += configs.requestProxy.host;
    proxyString += ':';
    proxyString += configs.requestProxy.port;
    configs.requestProxyString = proxyString;
  }
};