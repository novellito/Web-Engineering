const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = mongoose.Schema({
  content: {
    type: String
  },
  from: {
    type: String
  },
  to: {
    type: String
  }
});

const Item = (module.exports = mongoose.model('Message', MessageSchema));
