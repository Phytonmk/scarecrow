module.exports = (tg, callback) => {
  const events = require(__dirname + '/events.json');
  for (let event of events) {
    tg.on(event, (ctx) => {
      callback({event, ctx});
    });
  }
}