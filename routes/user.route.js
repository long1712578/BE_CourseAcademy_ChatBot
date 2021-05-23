const express = require('express');
const bcrypt = require('bcrypt');

const userModel = require('../Models/user.model');

const router = express.Router();

//signup
router.post('/', async (req, res) => {
    const user = req.body;
    user.is_delete = 1;
    user.password = bcrypt.hashSync(user.password, 10);
    const ids = await userModel.add(user);
    user.id = ids[0];
    delete user.password;

    res.status(201).json(user);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id * 1 || 0;
    const data = req.body;
    const result = await userModel.update(id, data);
    if (result == null) res.status(400).json({ message: "Username is exist" });
    if (result > 0) res.status(200).json({ message: result + " row change" });
    else res.status(202).json({ message: "No change" });
})
module.exports = router;