const moment = require('moment');

const obj = {
  cc: moment(),
  id: 2,
};

// const date = moment();
console.log(obj.cc);

console.log(obj.cc.format('DD MMM YYYY h:mm a'));
