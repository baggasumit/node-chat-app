const socket = io(); // eslint-disable-line no-undef

socket.on('connect', () => {
  console.log('Connected to server');

  socket.emit('createMessage', {
    from: 'SumitB',
    text: 'Hey, this is Sumit',
  });
});

socket.on('newMessage', (msg) => {
  console.log('New Message', msg);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
