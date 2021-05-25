const express = require('express');
const likeModel = require('../../model/user/like.model');
const router = express.Router();

//get user isLike course
router.get('/:idUser/:idCourse', async function (req, res) {
    const idUser=req.params.idUser;
    const idCourse=req.params.idCourse;
    let isLike;
    try {
        isLike = await likeModel.isLike(idUser,idCourse)
    } catch {
        res.status('400').json('Can not get all course ')
    }
    res.json(isLike);

})

module.exports =router;