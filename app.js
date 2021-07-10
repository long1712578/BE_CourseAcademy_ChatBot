const express = require('express');
const moment = require('moment');
const morgan = require('morgan');
require('express-async-errors');
const cors = require('cors');
const passport = require('passport');
const FacebookStrategy  = require('passport-facebook').Strategy;
const session  = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config/login.config');

const auth = require('./middlewares/auth.mdw');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
// Passport session setup. 
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new FacebookStrategy({
  clientID: config.facebook_key,
  clientSecret:config.facebook_secret ,
  callbackURL: config.callback_url
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    console.log(accessToken, refreshToken, profile, done);
    return done(null, profile);
    //Check whether the User exists or not using profile.id
    // if(config.use_database) {
    //    //Further code of Database.
    // }
    // return done(null, profile);
  });
}
));
app.use(cookieParser()); //Parse cookie
app.use(bodyParser.urlencoded({ extended: false })); //Parse body để get data
app.use(session({ secret: 'keyboard cat', key: 'sid'}));  //Save user login
app.use(passport.initialize());
app.use(passport.session());

// anonymous
app.use('/api/sign-up', require('./routes/user.route'));
app.use('/api/sign-in', require('./routes/auth.route'));

// admin
app.use('/api/admin',auth, require('./routes/user.admin.route'));
app.use('/api/category', require('./routes/category.route'));
app.use('/api/field', require('./routes/field.route'));
app.use('/api/course', require('./routes/course.route'));
app.use('/api/user', require('./routes/user.route'));
//login facebook
app.use('/auth/facebook', require('./routes/login.route'));
//logout facebook
//app.use('/logout');

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