const authConfig = require('../config/auth.config');
const jwt =require('jsonwebtoken');

module.exports = function (req, res, next) {
    const accessToken = req.headers.authorization;
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, authConfig.secret);
        req.accessTokenPayload = decoded;
        next();
      } catch (err) {
        console.log(err);
        return res.status(401).json({
          message: 'Invalid access token!'
        });
      }
    } else {
      return res.status(400).json({
        message: 'Access token not found!'
      });
    }
  }