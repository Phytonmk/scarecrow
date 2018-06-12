const axios = require('axios');
module.exports = (configs) => {
  const getWebHookInfo = () =>  
    axios.post(`https://api.telegram.org/bot${configs.logger.telegram.token}/getWebHookInfo`, {}, (configs.requestProxy ? {proxy: configs.requestProxy} : {}))
      .then(response => console.log(response.data))
      .catch((e)=>{console.log('Unable to log:', e)});

  const headers = {'content-type': 'multipart/form-data'};
  const setWebHook = (url, certificate, max_connections, allowed_updates) => {
    const data =
    return axios.post(`https://api.telegram.org/bot${configs.logger.telegram.token}/getWebHookInfo`, data, (configs.requestProxy ? {proxy: configs.requestProxy, headers} : {headers}))
      .then(response => console.log(response.data))
      .catch((e)=>{console.log('Unable to log:', e)});
  }

  /*
  bot.getWebHookInfo().then(webHookInfo => {
      if (webHookInfo.url !== `${ip.address()}:${configs.port}/bot${configs.token}` || !webHookInfo.has_custom_certificate) {
        bot.setWebHook(`${ip.address()}:${configs.port}/bot${configs.token}`, {
          certificate: __dirname  + '/../ssl/webhook_cert.pem'
        }).then(() => {
          bot.getWebHookInfo().then((webHookInfo) => {
            console.log(`Webhooks have been set on ${ip.address()}:${configs.port}/bot${configs.token}`);
          });
        }).catch(console.log);
      } else {
        console.log(`Webhooks are already set on ${ip.address()}:${configs.port}/bot${configs.token}`);
      }
    })
  */
}