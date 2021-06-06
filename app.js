const express = require('express');
const moment = require('moment');
const morgan = require('morgan');
require('express-async-errors');
const cors = require('cors');

const globalErrorHandler = require('./controllers/error.controller');
const AppError = require('./utils/app_error');
const auth = require('./middlewares/auth.mdw');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// anonymous
app.use('/api/sign-up', require('./routes/user.route'));
app.use('/api/sign-in', require('./routes/auth.route'));

// admin
app.use('/api/admin', require('./routes/user.admin.route'));
app.use('/api/category', require('./routes/category.route'));
app.use('/api/field', require('./routes/field.route'));
app.use('/api/course', require('./routes/course.route'));
app.use('/api/user', require('./routes/user.route'));
app.use('/api/video', require('./routes/video.route'));

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>"

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});


app.get('/err', function (req, res) {
  throw new Error('Error!');
})

// app.all('*', (req, res, next) => {
//   return next(new AppError(`Can't find ${req.originalUrl} on server`, 400));
// });



app.use(function (req, res, next) {
  res.status(404).json({
    error_message: 'Endpoint not found'
  });
})

app.use(globalErrorHandler);




const PORT = 5000;
app.listen(PORT, function () {
  console.log(`Academy api is running at http://localhost:${PORT}`);
})