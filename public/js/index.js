const socket = io(); // eslint-disable-line no-undef

socket.on('connect', () => {
  console.log('Connected to server');

  // socket.emit('createMessage', {
  //   from: 'SumitB',
  //   text: 'Hey, this is Sumit',
  // });
});

socket.on('newMessage', (msg) => {
  console.log('New Message', msg);
  const $messages = document.querySelector('#messages');
  const $message = document.createElement('li');
  $message.innerText = `${msg.from}: ${msg.text}`;
  $messages.appendChild($message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

document
  .querySelector('#message-form')
  .addEventListener('submit', function(evt) {
    evt.preventDefault();
    const $messageInput = document.querySelector('input[name="message"]');
    const message = $messageInput.value;
    socket.emit('createMessage', {
      from: 'User',
      text: message,
    });
  });
