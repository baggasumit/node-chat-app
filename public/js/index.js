const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('newMessage', (msg) => {
  const formattedTime = moment(msg.createdAt).format('hh:mm a');
  const $messages = document.querySelector('#messages');
  const template = document.querySelector('#message-template').innerHTML;
  const html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    createdAt: formattedTime,
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('newLocationMessage', (locationMsg) => {
  const formattedTime = moment(locationMsg.createdAt).format('hh:mm a');
  const $messages = document.querySelector('#messages');
  const template = document.querySelector('#location-message-template')
    .innerHTML;
  const html = Mustache.render(template, {
    from: locationMsg.from,
    url: locationMsg.url,
    createdAt: formattedTime,
  });
  $messages.insertAdjacentHTML('beforeend', html);
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
    $messageInput.value = '';
    socket.emit('createMessage', {
      from: 'User',
      text: message,
    });
  });

const locationButton = document.querySelector('#send-location');
locationButton.addEventListener('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  this.disabled = true;
  this.innerText = 'Sending Location ...';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      this.disabled = false;
      this.innerText = 'Send Location';
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    () => {
      this.disabled = false;
      this.innerText = 'Send Location';
      alert('Unable to fetch location');
    }
  );
});
