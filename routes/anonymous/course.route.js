const express = require('express');
const courseModel = require('../../model/anonymous/course.model');

const router = express.Router();

router.get('/', async function (req, res) {
    let listCourse;
    try {
        listCourse = await courseModel.all();
    } catch {
        res.status(400).json('Can not get all course ')
    }
    res.json(listCourse);

})

//Hiển thị 10 khoá học được xem nhiều nhất (ở mọi lĩnh vực)
router.get('/most-view', async function (req, res) {
    let listCourseMost;
    try {
        listCourseMost = await courseModel.mostView();
    } catch {
        res.status(400).json('Can not get course have most view')
    }

    res.json(listCourseMost);
})

//Hiển thị 10 khoá học mới nhất (ở mọi lĩnh vực)
router.get('/new-course', async function (req, res) {
    let listCourseMost;
    try {
        listCourseMost = await courseModel.newCourse();
    } catch {
        res.status('400').json('Can not get top new course')
    }
    res.json(listCourseMost);
})

//Hiển thị danh sách lĩnh vực được đăng ký học nhiều nhất trong tuần qua
router.get('/most-regis', async function (req, res) {
    let listCourseMost;
    try {
        listCourseMost = await courseModel.mostRegis();
    } catch {
        res.status('400').json('Can not get top registration in week ')
    }
    res.json(listCourseMost)
})

//Hiển thị 3-4 khoá học nổi bật nhất trong tuần qua
router.get('/most-highlight', async function (req, res) {
    let listCourseMost;
    try {
        listCourseMost = await courseModel.mostHighLight();
    } catch {
        res.status('400').json('Can not get top highlight in week ')
    }
    res.json(listCourseMost)

})


//Xem chi tiết khoá học
//thông tin của một khóa học
router.get('/information/:id', async function (req, res) {
    const id = req.params.id||0;
    let inforCourse;
    try {
        inforCourse = await courseModel.informationCourse(id);
    } catch {
        res.status('400').json('Can not get information course')
    }
    res.json(inforCourse);
})


module.exports = router;