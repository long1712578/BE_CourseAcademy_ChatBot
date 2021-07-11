const express = require('express');
const roleModel = require('../models/role.model');
const router = express.Router();

router.get('/', async (req, res) => {
    const result = await roleModel.all();
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
})

module.exports = router;