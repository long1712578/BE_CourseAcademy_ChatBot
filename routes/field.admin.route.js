const express = require('express');
const bcrypt = require('bcrypt');

const fieldModel = require('../Models/course_field.model');

const router = express.Router();

// add field
router.post('/', async (req,res) => {
    const name = req.body.name;
    var field = {
        name: name,
    }
    var newField = await fieldModel.add(field);
    res.status(201).json(newField.id);
});
// delete Field
router.delete('/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    const field = await fieldModel.single(id);
    if( field === null){
        res.status(204).json();
    }
    await fieldModel.delete(id);
    return res.json();
});
// update Field
router.put('/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    const name = req.body.name || null;
    const image = req.body.image || null;
    if (name === null && image === null){
        return res.status(204).json();
    }
    const result = await fieldModel.update(id, name, image);
    if(result === null){
        return res.status(400).json();
    }
    return res.json();
})
module.exports = router;