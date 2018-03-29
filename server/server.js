const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  // socket.emit('newMessage', {
  //   from: 'JaneD',
  //   text: 'Hey, are you there?',
  //   createdAt: 123,
  // });

  // Send only to the socket connection user
  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcome to the Chat app')
  );

  // Send to everyone excluding the socket connection user
  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New user joined')
  );

  socket.on('createMessage', (message) => {
    console.log('create message', message);

    // Send to everyone including yourself
    io.emit('newMessage', generateMessage(message.from, message.text));

    // Send to everyone excluding yourself
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime(),
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    // Send to everyone including yourself
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', coords.latitude, coords.longitude)
    );
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

module.exports = {
  app,
};
