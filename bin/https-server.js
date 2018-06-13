module.exports = (app) => {
  const configs = app.configs;
  if (configs.webhooks) {
    const server = require('express')();
    const https = require('https');
    const bodyParser = require('body-parser');
    server.use(bodyParser.urlencoded({
      extended: true
    }));
    server.use(bodyParser.json());
    server.post(configs.webhooks.path, (req, res) => {
      app.tg.processUpdate(req.body);
      res.status(200);
      res.end('');
    });
    const sslconfigs = {
      key: fs.readFileSync(configs.webhooks.certs.private),
      cert: fs.readFileSync(configs.webhooks.certs.public)
    };
    https.createServer(sslconfigs, app).listen(configs.webhooks.port);
  }
}