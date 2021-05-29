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

router.get('/most-view', async function (req, res) {
    let listCourseMost;
    try {
        listCourseMost = await courseModel.mostView();
    } catch {
        res.status('400').json('Can not get course have most view')
    }
    if(listCourseMost.length<1)
    {
        res.status(200).json('List course most view is empty');
    }
    res.json(listCourseMost);
})
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
module.exports = router;