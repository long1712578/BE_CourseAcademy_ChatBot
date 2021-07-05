const express = require('express');
const router = express.Router();

const courseOrderModel = require('./../models/course_order.model');

router.get('/', async (req, res) => {
    const filter = req.query;
    const result = await courseOrderModel.all(filter);
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
})

module.exports = router;