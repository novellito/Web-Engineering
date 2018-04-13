var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http)

app.get('/', function(req, res){
  res.send('<h1>What are you doing here :O</h1>');
});


io.on('connection', function(socket){

    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('completed', function(res){
        console.log("completed");
        console.log(res);
        io.emit("updateCustomer", res);
    });

  });


http.listen(3000, function(){
  console.log('listening on port 3000');
});