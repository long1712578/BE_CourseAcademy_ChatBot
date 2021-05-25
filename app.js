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

app.get('/', function (req, res) {
    res.json({
        message: 'Hello from Huynh Sakila api'
    })
})

//anonymous
app.use('/api/anonymous/course', require('./routes/anonymous/course.route'));
app.use('/api/anonymous/list-course', require('./routes/anonymous/category.route'));
app.use('/api/user', require('./routes/user/like.route'));

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
    console.log(`Udemy api is running at http://localhost:${PORT}`);
})
