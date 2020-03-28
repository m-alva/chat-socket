var app = require('express');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var numUsers = 0;
var listUsers = [];

io.on('connection', function(socket) {
  var addedUser = false;
  console.log('a user connected', socket.id);

  socket.on('newMessage', data => {
    io.emit('newMessage', {
      username: socket.username,
      message: data
    });
  });

  socket.on('add user', username => {
    if (addedUser) return;

    const existUsername = listUsers.find(user => {
      return user.username === username;
    });
    if (!existUsername) {
      socket.username = username;
      ++numUsers;
      addedUser = true;
      socket.emit('login', {
        numUsers: numUsers,
        status: true
      });
      listUsers.push({
        username: socket.username
      });
      io.emit('userJoined', {
        listUsers,
        numUsers
      });
      socket.broadcast.emit('newUser', {
        username: socket.username
      });
    } else {
      socket.emit('login', {
        numUsers: numUsers,
        status: false
      });
    }
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('stopTyping', {
      username: socket.username
    });
  });

  socket.on('disconnect', function() {
    console.log('user disconnected', addedUser);
    if (addedUser) {
      --numUsers;
      const indexUser = listUsers.findIndex(user => {
        return user.username === socket.username;
      });
      if (indexUser > -1) {
        listUsers.splice(indexUser, 1);
      }

      socket.broadcast.emit('userLeft', {
        username: socket.username,
        numUsers: numUsers,
        listUsers
      });
    }
  });
});

http.listen(3001, function() {
  console.log('listering on *:3001');
});
