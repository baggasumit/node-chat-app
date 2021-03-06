const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);

    users.removeUser(socket.id); // in case he is part of some other room
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // Send only to the socket connection user
    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to the Chat app')
    );

    // Send to everyone excluding the socket connection user
    socket.broadcast
      .to(params.room)
      .emit(
        'newMessage',
        generateMessage('Admin', `${params.name} has joined the chat`)
      );

    callback();
  });

  socket.on('createMessage', (message) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      // Send to everyone including yourself
      io
        .to(user.room)
        .emit('newMessage', generateMessage(user.name, message.text));
    }

    // Send to everyone excluding yourself
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: moment(),
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);
    if (user) {
      // Send to everyone including yourself
      io
        .to(user.room)
        .emit(
          'newLocationMessage',
          generateLocationMessage(user.name, coords.latitude, coords.longitude)
        );
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io
        .to(user.room)
        .emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

module.exports = {
  app,
};
