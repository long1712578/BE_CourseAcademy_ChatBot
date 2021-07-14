const express = require('express');
const morgan = require('morgan');
require('express-async-errors');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// anonymous
app.use('/api/sign-up', require('./routes/user.route'));
app.use('/api/sign-in', require('./routes/auth.route'));

// admin
app.use('/api/admin', require('./routes/user.admin.route'));
app.use('/api/categories', require('./routes/category.route'));
app.use('/api/fields', require('./routes/field.route'));
app.use('/api/courses', require('./routes/course.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/videos', require('./routes/video.route'));
app.use('/api/orders', require('./routes/course_order.route'));
app.use('/api/roles', require('./routes/role.route'));
app.use('/api/documents', require('./routes/document.route'));


app.get('/err', function (req, res) {
  throw new Error('Error!');
})

app.use(function (req, res, next) {
  res.status(404).json({
    error_message: 'Endpoint not found'
  });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Academy api is running at http://localhost:${PORT}`);
})
