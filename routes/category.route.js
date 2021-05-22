const express = require('express');
const bcrypt = require('bcrypt');

const categoryModel = require('../Models/category.model');

const router = express.Router();

// add category
router.post('/', async (req,res) => {
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
router.delete('/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    const category = await categoryModel.single(id);
    if( category === null){
        res.status(204).json();
    }
    await categoryModel.delete(id);
    return res.json();
});
// update category
router.put('/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    const name = req.body.name;
    const result = await categoryModel.update(id, name);
    if(result === null){
        return res.status(400).json();
    }
    return res.json();
})
module.exports = router;