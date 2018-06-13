const fs = require('fs');
const axios = require('axios');
module.exports = (configs) => {
  

  if (!configs.webhooks)
    return;
  const logger = require(__dirname + '/../logger')(configs);
  
  const getWebHooksInfo = () =>  
    axios.post(`https://api.telegram.org/bot${configs.token}/getWebhookInfo`, {}, (configs.requestProxy ? {proxy: configs.requestProxy} : {}))

  const setWebHook = (url, certificate, max_connections, allowed_updates) => {
    return new Promise((resolve, reject) => {
      fs.readFile(certificate, (err, certFile) => {
        if (err) {
          reject(err);
          return;
        }
        const headers = {'content-type': 'multipart/form-data'};
        const data = {url, certificate: certFile};
        if (max_connections)
          data.max_connections = max_connections;
        if (allowed_updates)
          data.allowed_updates = allowed_updates;
        axios.post(`https://api.telegram.org/bot${configs.token}/setWebhook`, data, (configs.requestProxy ? {proxy: configs.requestProxy, headers} : {headers}))
          .then(response => resolve(response))
          .catch((e)=>{reject(e)});
      });
    });
  }

  const whConfigs = configs.webhooks;
  getWebHooksInfo().then(response => {
    let webHooksInfo = response.data;
    if (webHooksInfo.url !== `${whConfigs.domain}:${whConfigs.port}/${whConfigs.path}` || !webHooksInfo.has_custom_certificate) {
      setWebHook(`${whConfigs.domain}:${whConfigs.port}/${whConfigs.path}`, whConfigs.certs.public).then(() => {
        getWebHooksInfo().then((response) => {
          webHooksInfo = response.data;
          logger.info(`Webhooks have been set on ${webHooksInfo.url}`);
        }).catch((e) => {
          logger.error(`Cannot get webhooks info after setting it: ${e}\nWith settings ${JSON.stringify(configs.webhooks, null, 2)}`);
        });
      }).catch((e) => {
        logger.error(`Cannot set webhooks: ${e}\nWith settings ${JSON.stringify(configs.webhooks, null, 2)}`);
      });
    } else {
      logger.info(`Webhooks are already set on ${webHooksInfo.url}`);
    }
  }).catch((e) => {
    logger.error(`Cannot get webhooks info: ${e}\nWith settings ${JSON.stringify(configs.webhooks, null, 2)}`);
  });
}