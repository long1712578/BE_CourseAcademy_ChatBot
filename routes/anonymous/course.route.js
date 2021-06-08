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
    if(listCourse.length<1)
    {
        res.status(200).json('List course is empty')
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
    if(listCourseMost.length<1)
    {
        res.status(200).json('List course most view is empty');
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
    if(listCourseMost.length<1)
    {
        res.status(200).json('List course new is empty');
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
    if(listCourseMost.length<1)
    {
        res.status(200).json('List course most registration is empty');
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
    if(listCourseMost.length<1)
    {
        res.status(200).json('List course most high light is empty');
    }
    res.json(listCourseMost)

})


//Xem chi tiết khoá học
//thông tin của một khóa học
router.get('/:id/infor', async function (req, res) {
    const id = req.params.id||0;
    let inforCourse;
    try {
        inforCourse = await courseModel.informationCourse(id);
    } catch {
        res.status('400').json('Can not get information course')
    }
    if(inforCourse.length<1)
    {
        res.status(200).json('Can not get information course');
    }
    res.json(inforCourse);
})

//5 khoá học khác cùng lĩnh vực được mua nhiều nhất
router.get('/:id/same-category-most-buy', async function (req, res) {
    const id = req.params.id||0;
    let sameCategoryCourseMostBuy
    try{
         sameCategoryCourseMostBuy = await courseModel.mostBuySameCategory(id);
    } catch {
        res.status('400').json('Can not get same category most buy')
    }
    if(sameCategoryCourseMostBuy.length<1)
    {
        res.status(200).json('Can not get course same category most buy');
    }

    res.json(sameCategoryCourseMostBuy);

})

//Thông tin giảng viên
router.get('/:id/teacher', async function (req, res) {
        const id = req.params.id||0;
        let inforTeacher;
        try{
            inforTeacher = await courseModel.teacherCreate(id)
        }catch {
            res.status('400').json('Can not get teacher of course')
        }
    if(inforTeacher.length<1)
    {
        res.status(200).json('Can not get teacher of course');
    }

    res.json(inforTeacher);
    }
)

// Danh sách feedback của học viên về khoá học
router.get('/:id/feedback',async function (req,res){
    const id = req.params.id||0;
    let listFeedback;
    try{
        listFeedback = await courseModel.listFeedback(id)
    }catch {
        res.status('400').json('Can not get list feedback of course')
    }
    if(listFeedback.length<1)
    {
        res.status(200).json('No comment of course');
    }

    res.json(listFeedback);
})
module.exports = router;