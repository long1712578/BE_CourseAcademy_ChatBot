const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const random = require('randomstring');
const userModel = require('../models/user.model');

const router = express.Router();

//Login
router.post('/', async (req, res) => {
    const user = await userModel.singleByUserName(req.body.username);
    if(user === null) {
        res.status(400).json("Use not exist or not active");
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).json("Password fail");
    }
    const payLoad = {
        userId: user.id,
        fullName: user.fullname,
        userName: user.username,
        address: user.address,
        phone: user.phone,
        birthDate: user.date_of_birth,
        email: user.email,
        role_id: user.role_id
    };

    const opts = {
        expiresIn: 24 * 60 *60 // seconds(1 ngay)
    }
    const accessToken = jwt.sign(payLoad, authConfig.secret, opts);
    const refreshToken = random.generate(50);
    await userModel.patchRFToken(user.id, refreshToken);

    return res.json({
        authenticated: true,
        accessToken,
        refreshToken,
        role: user.role_id
    });
});

router.post('/refesh', async (req, res) => {
    const accessToken = req.body.accessToken;
    const refreshToken = req.body.refreshToken;
    const payLoad = jwt.verify(accessToken, authConfig.secret, { ignoreExpiration: true });
    const userId = payLoad.userId;
    const newPayLoad = {
        userId: payLoad.userId,
        fullName: payLoad.fullName,
        userName: payLoad.userName,
        address: payLoad.address,
        phone: payLoad.phone,
        birthDate: payLoad.birthDate,
        email: payLoad.email,
        role_id: user.role_id 
    };

    const ret = await userModel.isValidRFToken(newPayLoad, refreshToken);
    if (ret === true) {
        const newAccessToken = jwt.sign({ userId }, authConfig.secret, { expiresIn: 60 * 10 });
        return res.json({
            accessToken: newAccessToken
        });
    }
    return res.status(400).json({
        message: 'Refresh token is revoked !!'
    });
})

// router.post('/', async (req, res) => {
//     const user = await userModel.singleByUserName(req.body.username);
//     if (user === null) {
//         return res.status(400).json("Use not exist");
//     }
//     if (!bcrypt.compareSync(req.body.password, user.password)) {
//         return res.status(400).json("Password fail");
//     }
//     const payLoad = {
//         userId: user.id,
//         fullName: user.fullname,
//         userName: user.username,
//         address: user.address,
//         phone: user.phone,
//         birthDate: user.date_of_birth,
//         email: user.email,
//         role_id: user.role_id
//     };

//     const opts = {
//         expiresIn: 10 * 60 // seconds(10p)
//     }
//     const accessToken = jwt.sign(payLoad, authConfig.secret, opts);
//     const refreshToken = random.generate(50);
//     await userModel.patchRFToken(user.id, refreshToken);

//     return res.json({
//         authenticated: true,
//         accessToken,
//         refreshToken,
//         role: user.role_id
//     });
// });

module.exports = router;