const express = require('express');
const courseModel = require('../../model/anonymous/course.model');

const router = express.Router();

router.get('/', async function (req, res) {
    let listCourse;
    try {
        listCourse = await courseModel.all();
    } catch {
        res.status('400').json('Can not get all course ')
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
    res.json(listCourseMost);
})
router.get('/new-course', async function (req, res) {
    let listCourseMost;
    try {
        listCourseMost = await courseModel.newCourse();
    } catch {
        res.status('400').json('Can not get top new course')
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
    res.json(listCourseMost);
})

router.get('/most-highlight', async function (req, res) {
    let listCourseMost;
    try {
        listCourseMost = await courseModel.mostHighLight();
    } catch {
        res.status('400').json('Can not get top highlight in week ')
    }
    res.json(listCourseMost);

})

router.get('/:id/infor', async function (req, res) {
    const id = req.params.id;
    let inforCourse;
    try {
        inforCourse = await courseModel.informationCourse(id);
    } catch {
        res.status('400').json('Can not get information course')
    }
    //const sameCategoryCourseMostBuy=await courseModel.mostBuySameCategory(id);
    res.json(inforCourse);
})

router.get('/:id/same-category-most-buy', async function (req, res) {
    const id = req.params.id;
    let sameCategoryCourseMostBuy
    try{
         sameCategoryCourseMostBuy = await courseModel.mostBuySameCategory(id);
    } catch {
        res.status('400').json('Can not get same category most buy')
    }

    res.json(sameCategoryCourseMostBuy);

})
router.get('/:id/teacher', async function (req, res) {
        const id = req.params.id;
        let inforTeacher;
        try{
            inforTeacher = await courseModel.teacherCreate(id)
        }catch {
            res.status('400').json('Can not get teacher of course')
        }

        res.json(inforTeacher);
    }
)
module.exports = router;