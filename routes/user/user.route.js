const express = require('express');
const userModel = require('../../model/user/user.model');
const router = express.Router();

router.get('/:id', async function (req, res) {
    const idUser = req.params.id
    let inforUser
    try {
        inforUser = await userModel.getInforUser(idUser);
    } catch {
        res.status('400').json('Can not get information user ')
    }
    if (inforUser.length < 1) {
        res.status('200').json('User is not exist or inactive ')
    }
    res.json(inforUser)

})

router.put('/:id', async function (req, res) {
    const user = req.body;
    const id = req.params.id || 0;
    try {
        const updateUser = await userModel.updateUser(id, user);
        console.log(updateUser)
    } catch {
        res.status(400).json("Can't update user");
    }

    res.status(200).json("Update user success with id: " + id);
})

router.get('/:id/watch-list', async function (req, res) {
    const idUser = req.params.id;
    let watchList;
    try {
        watchList = await userModel.watchList(idUser)
    } catch {
        res.status('400').json('Can not get all course ')
    }
    if (watchList.length < 1) {
        res.status('200').json('Watch list is empty')
    }
    res.json(watchList);
})

router.delete('/:id/watch-list', async function (req, res) {
    const idUser = req.params.id || 0;
    const idCourse = req.body.course_id;
    try {
        const unLikeCourse = await userModel.unLikeCourse(idUser, idCourse);
    } catch {
        res.status(400).json("Can't unlike this course")
    }
    res.status(200).json("Unlike success");
})

router.get('/:id/list-course-enroll', async function (req, res) {
    const idUser = req.params.id || 0;
    let listCourseEnroll;
    try
    {
        listCourseEnroll=await userModel.listCourseEnroll(idUser);
    }catch {
        res.status(400).json('Can not get list course enroll');
    }
    if(listCourseEnroll<1)
    {
        res.status(200).json('List course enroll is empty');
    }
    res.json(listCourseEnroll);
})
module.exports = router;