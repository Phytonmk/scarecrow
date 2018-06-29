const initScarecrow = require('../index.js');

initScarecrow({
  folders: {
    controllers: __dirname + '/controllers',
    // intervals: __dirname + '/intervals',
    // helpers: __dirname + '/heplers',
    // models: __dirname + '/models',
    texts: __dirname + '/texts',
  },
  languages: {
    many: true,
    main: 'en'
  },
  database: 'mongodb://testAdmin:password@localhost:27017/frameworkTesting',
  proxy: {
    useProxy: false,
    host: '178.238.235.228',
    port: '3128', 
    auth: {
      username: '',
      password: ''
    }
  },
  token: '464674881:AAEAt1vizzm68hFxpXM_VdyQFZk4WVCywxM',
  // webhooks: {
  //   port: '443',
  //   domain: '127.0.0.1',
  //   path: 'AAEAt1vizzm68hFxpXM_VdyQFZk4WVCywxM',
  //   certs: {
  //     private: __dirname + '/ssl/private',
  //     public: __dirname + '/ssl/public',
  //   },
  //   // max_connections: 40,
  //   // allowed_updates: null,
  // },
  workers: {
    max: 10,
    min: 1,
    normal: 2
  },
  logger: {
    // folder: __dirname + '/logs',
    telegram: {
      recipient: 156646228,
      token: '464674881:AAEAt1vizzm68hFxpXM_VdyQFZk4WVCywxM'
    },
    console: true
  },
  autoexit: 1000 * 60 * 60 * 24 * 7,
  router: __dirname + '/router.js',
  // banchmark: __dirname + '/banchamrk.json'
});