const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    required: true
  },
  sentMessages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],
  receivedMessages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],
  userId: {
    type: String,
    required: true
  }
});

const User = (module.exports = mongoose.model('User', UserSchema));
