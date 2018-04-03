const socket = io();

function scrollToBottom() {
  const $messages = document.querySelector('#messages');
  if (
    $messages.clientHeight + $messages.scrollTop + 200 >=
    $messages.scrollHeight
  ) {
    $messages.scrollTop = $messages.scrollHeight;
    console.log('Should scroll');
  }
}

function getParams(query) {
  if (!query) {
    return {};
  }

  return (/^[?#]/.test(query) ? query.slice(1) : query)
    .split('&')
    .reduce((params, param) => {
      let [key, value] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, {});
}

socket.on('connect', () => {
  console.log('Connected to server');
  const params = getParams(window.location.search);
  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
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
  scrollToBottom();
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
  scrollToBottom();
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('updateUserList', (users) => {
  console.log('Users list', users);
  const template = document.querySelector('#user-list-template').innerHTML;
  const renderedUserList = Mustache.render(template, {
    users,
  });
  const $userList = document.querySelector('#users');
  $userList.innerHTML = renderedUserList;
});

document
  .querySelector('#message-form')
  .addEventListener('submit', function(evt) {
    evt.preventDefault();
    const $messageInput = document.querySelector('input[name="message"]');
    const message = $messageInput.value;
    $messageInput.value = '';
    socket.emit('createMessage', {
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
