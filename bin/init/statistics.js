module.exports = (app) => {
  app.stats = {};

  app.stats.clear = (statTitle) =>
    app.models.Statistic.remove({title: statTitle});

  app.stats.getSpecific = (statTitle) =>
    app.models.Statistic.find({title: statTitle});

  app.stats.get = (offset, limit) =>
    app.models.Statistic.find({}).skip(offset).limit(limit);

  app.stats.count = (statTitle) =>
    app.models.Statistic.count({title: statTitle});

  app.stats.insert = (statTitle) => 
    app.models.Statistic.insert({title: statTitle});

  app.stats.inc = (statTitle, amount=1) => 
    app.models.Statistic.update({title:statTitle}, { $inc: {counter: amount}}, {upsert: true});
}