const express = require('express');

const courseModel = require('../Models/course.model');
const fieldModel = require('../models/course_field.model');
const categoryModel = require('../models/category.model');
const teacherModel = require('../models/user.model');
const userModel = require('../models/user.model');
const data = require('../config/const.config');

const router = express.Router();

router.get('/', async (req,res) => {
    const filter = req.query;
    const result = await courseModel.all(filter);
    if(result.totalPage === 0){
        return res.status(204).json();
    }
    return res.json(result);
}),
router.delete('/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    const course = await courseModel.single(id);
    if(course === null){
        res.status(204).json();
    }
    await courseModel.delete(id);
    return res.json();
})

module.exports = router;