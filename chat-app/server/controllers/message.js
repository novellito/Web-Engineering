const MessageModel = require('../models/message');

// add a message to the database
exports.addMessage = (req, res) => {
  const message = new MessageModel({
    content: req.body.msg,
    from: req.body.from,
    to: req.body.to
  });
  message.save().then(
    data => {
      res.json({ msg: 'message added!', data });
    },
    e => {
      console.log('Message saving error!');
      res.json({ msg: 'error!' });
    }
  );
};
