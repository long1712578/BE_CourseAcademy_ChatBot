const express = require('express');

const courseModel = require('../Models/course.model');
const fieldModel = require('../models/course_field.model');
const categoryModel = require('../models/category.model');
const teacherModel = require('../models/user.model');
const userModel = require('../models/user.model');
const data = require('../config/const.config');
const courseController = require('../controllers/course.controller');
const { route } = require('./video.route');

const router = express.Router();

router.get('/', async (req, res) => {
    const filter = req.query;
    const result = await courseModel.all(filter);
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const course = await courseModel.single(id);
    if (course === null) {
        return res.status(204);
    }
    await courseModel.delete(id);
    return res.json();
});
router.post('/:id', async (req, res) => {
    console.log("route add course");
    return res.status(200);
});
router.post('/:id/upload-video', courseController.uploadVideoForCourse);

module.exports = router;