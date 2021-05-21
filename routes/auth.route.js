const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const random = require('randomstring');
const userModel = require('../models/user.model');

const router = express.Router();

//Login
router.post('/', async (req,res) => {
    const user = await userModel.singleByUserName(req.body.username);
    console.log(user);
    if(user === null) {
        return res.json({
            authenticated: false
        });
    }
    console.log(user.password);
    console.log(req.body.password);
    if(!bcrypt.compareSync(req.body.password, user.password)){
        return res.json({
            authenticated: false
        });
    }
    const payLoad = {
        userId: user.id
    };

    const opts = {
        expiresIn: 10 * 60 // seconds(10p)
    }
    const accessToken = jwt.sign(payLoad, authConfig.secret, opts);
    const refreshToken = random.generate(50);
    await userModel.patchRFToken(user.id, refreshToken);

    return res.json({
        authenticated: true,
        accessToken,
        refreshToken
    });
});

router.post('/refesh', async(req,res) => {
    const accessToken = req.body.accessToken;
    const refreshToken = req.body.refreshToken;
    const payLoad = jwt.verify(accessToken, authConfig.secret, {ignoreExpiration: true});
    const userId = payLoad.userId;
    const ret = await userModel.isValidRFToken(userId, refreshToken);
    if(ret === true){
        const newAccessToken = jwt.sign({userId}, authConfig.secret, { expiresIn: 60 * 10 } );
        return res.json({
            accessToken: newAccessToken
        });
    }
    return res.status(400).json({
        message: 'Refresh token is revoked !!'
    });
})

module.exports =router;