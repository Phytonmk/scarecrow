const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
const StatisticScheme = new Schema({
  title: String,
  couted: {type: Boolean, default: false},
  couter: {type: Date, default: 1},
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Statistic', StatisticScheme);