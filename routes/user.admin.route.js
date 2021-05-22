const express = require('express');

const orderModel = require('../Models/order.model');
const userModel = require('../models/user.model');

const router = express.Router();

// Get user had register
router.get('/user-register', async (req,res) => {
    var listUser = await orderModel.getAllRegisteredUsers();
    if(listUser === null){
        return res.status(204).json();
    }
    return res.json(listUser);
});
// Delete user had register
router.delete('/user-register/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    let check = false;
    var listUser = await orderModel.getAllRegisteredUsers();
    if(listUser === null){
        return res.status(204).json('user not exist!!!');
    }else{
        for(let user of listUser){
            if(user.user_id === id){
                check = true;
            }
        }
    }
    if(check === false){
        return res.status(204).json('Can user delete before!!!');
    }
    await userModel.delete(id);
    return res.json(id);
});
// Get list teacher
router.get('/teacher', async (req,res) => {
    var listTeacher = await userModel.getAllTeacher();
    if(listTeacher === null){
        return res.status(204).json('Not teacher.');
    }
    return res.json(listTeacher);
});
// delete teacher
router.delete('/teacher/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    var teacher = await userModel.getTeacherById(id);
    if (teacher === null){
        return res.status(204).json('...');
    }
    await userModel.delete(id);
    return res.json(id);
})
module.exports = router;