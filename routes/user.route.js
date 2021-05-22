const express = require('express');
const bcrypt = require('bcrypt');

const userModel = require('../Models/user.model');

const router = express.Router();

//signup
router.post('/', async (req,res) => {
    const user = req.body;
    user.is_delete =1;
    user.password = bcrypt.hashSync(user.password, 10);
    const ids = await userModel.add(user);
    user.id = ids[0];
    delete user.password;

    res.status(201).json(user);
});
module.exports = router;