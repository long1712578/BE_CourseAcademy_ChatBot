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
    if (listCourse !== null) {
        res.json(listCourse);
    } else
        res.status('200').json('Course is empty')

})

router.get('/most-view', async function (req, res) {
    let listCourseMost;
    try {
        listCourseMost = await courseModel.mostView();
    } catch {
        res.status('400').json('Can not get course have most view')
    }
    if (listCourseMost !== null) {
        res.json(listCourseMost);
    } else
        res.status('200').json('Most view is empty')
})
router.get('/new-course', async function (req, res) {
    let listCourseMost;
    try {
        listCourseMost = await courseModel.newCourse();
    } catch {
        res.status('400').json('Can not get top new course')
    }
    if (listCourseMost !== null) {
        res.json(listCourseMost);
    } else
        res.status('200').json('New course is empty')
})

router.get('/most-regis', async function (req, res) {
    let listCourseMost;
    try {
        listCourseMost = await courseModel.mostRegis();
    } catch {
        res.status('400').json('Can not get top registration in week ')
    }
    if (listCourseMost !== null) {
        res.json(listCourseMost);
    } else
        res.status('200').json('Top registration in week is empty')
})

router.get('/most-highlight', async function (req, res) {
    let listCourseMost;
    try {
        listCourseMost = await courseModel.mostHighLight();
    } catch {
        res.status('400').json('Can not get top highlight in week ')
    }
    if (listCourseMost !== null) {
        res.json(listCourseMost);
    } else
        res.status('200').json('Top highlights in week is empty')
})

router.get('/:id', async function (req, res) {
    const id = req.params.id;
    let inforCourse;
    try {
        inforCourse = await courseModel.informationCourse(id);
    } catch {
        res.status('400').json('Can not get information course')
    }
    //const sameCategoryCourseMostBuy=await courseModel.mostBuySameCategory(id);

    console.log(inforCourse)
    if (!inforCourse) {
        res.json('Course find not found');
    } else
        res.json(inforCourse);
})

router.get('/:id/same-category-most-buy', async function (req, res) {
    const id = req.params.id;
    //const inforCourse=await courseModel.informationCourse(id);
    const sameCategoryCourseMostBuy = await courseModel.mostBuySameCategory(id);
    if (sameCategoryCourseMostBuy !== null) {
        res.json(sameCategoryCourseMostBuy);
    } else
        res.status('200').json('Same category most buy find not found')
})
router.get('/:id/teacher', async function (req, res) {
        const id = req.params.id;
        //const inforCourse=await courseModel.informationCourse(id);
        //const sameCategoryCourseMostBuy=await courseModel.mostBuySameCategory(id);
        const inforTeacher = await courseModel.teacherCreate(id)
        if (!inforTeacher)
            res.json('Teacher of course find not found')
        else
            res.json(inforTeacher);
    }
)
module.exports = router;