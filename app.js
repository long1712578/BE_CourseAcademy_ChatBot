const express = require('express');
const moment = require('moment');
const morgan = require('morgan');
require('express-async-errors');
const cors = require('cors');

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

app.get('/err', function (req, res) {
  throw new Error('Error!');
})

app.use(function (req, res, next) {
  res.status(404).json({
    error_message: 'Endpoint not found'
  });
})

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    error_message: 'Something broke!'
  });
})



const PORT = 3000;
app.listen(PORT, function () {
  console.log(`Academy api is running at http://localhost:${PORT}`);
})