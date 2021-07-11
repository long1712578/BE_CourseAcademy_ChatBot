const express  = require('express')
const router   = express.Router();
const passport = require('passport')

module.exports = (function() {   

	router.get('/', passport.authenticate('facebook',{scope:'email'}));

	router.get('/callback',
	  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
	  function(req, res) {
	    res.redirect('/');
	  });

	router.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

    return router;    
})();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}