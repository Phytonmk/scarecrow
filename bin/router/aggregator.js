module.exports = (tg, callback, logError) => {
  const events = require(__dirname + '/events.json');
  for (let event of events.common) {
    tg.on(event, (ctx) => {
      callback({event, ctx});
    });
  }
  for (let event of events.errors) {
    tg.on(event, (e) => {
      logError(`${event} ${e}`);
    });
  }
}