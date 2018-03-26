const path = require('path');
const express = require('express');
// const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, '../public');

// const port = process.env.PORT;
const port = process.env.PORT || 3000;

const app = express();
app.use(express.static(publicPath));
// app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
  // console.log('NODE_ENV: ', process.env.NODE_ENV);
});

module.exports = {
  app,
};
