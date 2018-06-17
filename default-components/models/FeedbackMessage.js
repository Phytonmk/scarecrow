const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
const FeedbackMessageScheme = new Schema({
  from: Number,
  admin: Number,
  message_id: Number,
  userside_message_id: Number,
  answer_typing: Boolean
});

module.exports = mongoose.model('FeedbackMessage', FeedbackMessageScheme);