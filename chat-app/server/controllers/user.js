const UserModel = require('../models/user');

// list the possible recepients
exports.listRecepients = (req, res) => {
  let user = UserModel.find({
    userId: {
      $ne: req.params.userId
    }
  });

  user.then(
    data => {
      //   console.log(data);
      res.json({ users: data });
    },
    e => {
      res.json({ msg: 'error!' });
    }
  );
};

// verify the users login info
exports.verifyLogin = (req, res) => {
  let user = UserModel.findOne({
    username: `${req.body.data.username}`,
    password: `${req.body.data.password}`
  });

  user.then(
    data => {
      //   console.log(data);
      data === null
        ? res.json({ found: false })
        : res.json({ found: true, data });
    },
    e => {
      res.json({ msg: 'error!' });
    }
  );
};

// retrieve a user by their userId
exports.getUserById = (req, res) => {
  let user = UserModel.findOne({
    userId: `${req.params.userId}`
  })
    .populate('sentMessages')
    .populate('receivedMessages')
    .exec();

  user.then(
    data => {
      // console.log(data);
      data === null
        ? res.json({ found: false })
        : res.json({ found: true, data });
    },
    e => {
      console.log('User retrieving went wrong!');
      res.json({ found: false });
    }
  );
};

exports.addNewUser = (req, res) => {
  const newUser = {
    username: req.body.data.username,
    password: req.body.data.password,
    userId: req.body.data.userId
  };
  let user = new UserModel(newUser);
  user.save().then(
    data => {
      res.json({ msg: 'user Added!', data });
    },
    e => {
      console.log('saving error!');
      res.json({ msg: 'error!' });
    }
  );
};

// update the given user
exports.updateUser = (req, res) => {
  let user = UserModel.findOne({
    userId: `${req.params.userId}`
  });

  user.then(
    data => {
      if (req.body.sending) {
        data.sentMessages.push(req.body.msg);
        data.save();
      } else {
        data.receivedMessages.push(req.body.msg);
        data.save();
      }
      res.json({ msg: 'user updated!', data: data });
    },
    e => {
      console.log('updating error!');
      res.json({ msg: 'error!' });
    }
  );
};
