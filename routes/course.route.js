const express = require('express');

const courseModel = require('../Models/course.model');
const fieldModel = require('../models/course_field.model');
const categoryModel = require('../models/category.model');
const teacherModel = require('../models/user.model');
const userModel = require('../models/user.model');

const router = express.Router();

router.get('/', async (req,res) => {
    const index = parseInt(req.body.index)||1;
    const pageSize = parseInt(req.body.pageSize)||6;
    const categoryId = req.body.categoryId || null;
    const teacherId = req.body.teacherId || null;
    if(categoryId !== null){
        const category = await categoryModel.single(categoryId);
        if(category === null){
            res.status(204).json("Category no exist!!!");
        }
    }
    if(teacherId !==null){
        const teacher = await userModel.getTeacherById(teacherId);
        if(teacher === null){
            res.status(204).json("Teacher no exist!!!");
        }
    }
    const result = await courseModel.all(index, pageSize, categoryId, teacherId);
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