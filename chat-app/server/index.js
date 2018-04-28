const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const user = require('./routes/user');
const message = require('./routes/message');
const UserModel = require('./models/user');

const port = 5000;

mongoose.Promise = global.Promise;

mongoose.connect(
  'mongodb://localhost:27017/chatApp',
  {},
  err => (err ? console.log(err) : console.log('Connected!'))
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', user);
app.use('/api', message);

let clients = [];
io.on('connection', socket => {
  console.log('User Connected!');

  socket.on('storeClient', data => {
    let info = {
      clientId: data.clientId,
      socketId: socket.id
    };
    clients.push(info);
  });

  socket.on('message', data => {
    // search for the client and send the message if they are online
    let clientSearch = clients.find(client => client.clientId === data.to);
    if (clientSearch !== undefined) {
      socket.to(clientSearch.socketId).emit('sendMessage', {
        msg: data.msg,
        from: data.from,
        msgId: data.msgId
      });
    } else {
      console.log('user not online');
    }
  });

  socket.on('disconnect', () => {
    console.log('user has disconnected');
    for (var i = 0; i < clients.length; i++) {
      if (clients[i].socketId === socket.id) {
        clients.splice(i, 1);
        console.log('user has been removed');
        break;
      }
    }
  });
});

// Index Route
app.get('/', (req, res) => res.redirect('http://localhost:8080/'));

server.listen(port, () => console.log(`Server started on port ${port}`));
