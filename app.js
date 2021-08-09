const express = require('express');
const morgan = require('morgan');
const path = require('path');
require('express-async-errors');
const cors = require('cors');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config/login.config');
const authMdw = require('./middlewares/auth.mdw');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
// Passport session setup. 
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
passport.use(new FacebookStrategy({
  clientID: config.facebook_key,
  clientSecret: config.facebook_secret,
  callbackURL: config.callback_url
},
  function (accessToken, refreshToken, profile, done) {
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
app.use(session({ secret: 'keyboard cat', key: 'sid' }));  //Save user login
app.use(passport.initialize());
app.use(passport.session());

// anonymous
app.use('/api/sign-up', require('./routes/user.route'));
app.use('/api/sign-in', require('./routes/auth.route'));
app.use('/api/admin-sign-in', require('./routes/auth.route'));

// admin
app.use('/api/admin', authMdw,require('./routes/user.admin.route'));
app.use('/api/categories',authMdw, require('./routes/category.route'));
app.use('/api/fields',authMdw, require('./routes/field.route'));
app.use('/api/courses',authMdw, require('./routes/course.route'));
app.use('/api/users',authMdw, require('./routes/user.route'));
app.use('/api/videos',authMdw, require('./routes/video.route'));
app.use('/api/orders',authMdw, require('./routes/course_order.route'));
app.use('/api/roles',authMdw, require('./routes/role.route'));
app.use('/api/guest-course', require('./routes/anonymous/course.route'));
app.use('/api/documents', require('./routes/document.route'));//,authMdw
app.use('/api/comments',authMdw, require('./routes/rating.route'));
app.use('/api/chatbot',authMdw, require('./routes/chatbot.route'));

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
