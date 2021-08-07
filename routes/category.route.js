const express = require('express');
const bcrypt = require('bcrypt');

const categoryModel = require('../models/category.model');
const courseModel = require('../models/course.model');
const authMdw = require('../middlewares/auth.mdw');

const router = express.Router();

router.get('/', async (req, res) => {
    const filter = req.query;
    const result = await categoryModel.all(filter);
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
})

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const category = await categoryModel.single(id);
    if (category === null) {
        return res.status(204);
    }
    return res.json(category);
});

// add category
router.post('/', authMdw, async (req, res) => {
    const name = req.body.name;
    const last_update = new Date();
    var category = {
        name: name,
        last_update: last_update
    }
    var newCategory = await categoryModel.add(category);
    res.status(201).json(newCategory.id);
});
// delete category
router.delete('/:id', authMdw, async (req, res) => {
    const id = parseInt(req.params.id);
    const category = await categoryModel.single(id);
    console.log(category);
    if (category === null) {
        return res.status(204).json({ message: 'Delete fail because category not exist!!!' });
    }
    const courses = await courseModel.getCoursesByCategoryId(id);
    if (courses.length > 0) {
        return res.status(204).json({ message: 'Delete fail bacause category had courses!!!' })
    }
    await categoryModel.delete(id);
    return res.json();
});
// update category
router.put('/:id', authMdw, async (req, res) => {
    const id = parseInt(req.params.id);
    const name = req.body.name;
    const result = await categoryModel.update(id, name);
    if (result === null) {
        return res.status(400).json();
    }
    return res.json();
})
module.exports = router;