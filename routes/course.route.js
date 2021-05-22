const express = require('express');

const courseModel = require('../Models/course.model');

const router = express.Router();

router.get('/', async (req,res) => {
    const index = parseInt(req.body.index)||1;
    const pageSize = parseInt(req.body.pageSize);
    const result = await courseModel.all(index, pageSize);
    if(result.totalPage === 0){
        return res.status(204).json();
    }
    return res.json(result);
}),

module.exports = router;