const express=require('express');
const courseModel=require('../../model/anonymous/course.model');

const router=express.Router();

router.get('/',async function (req,res){
    const listCourse=await courseModel.all();
    res.json(listCourse);
})

router.get('/most-view',async function (req,res){
    const listCourseMost=await courseModel.mostView();
    res.json(listCourseMost);
})
router.get('/new-course',async function (req,res){
    const listCourseMost=await courseModel.newCourse();
    res.json(listCourseMost);
})

router.get('/most-regis',async function (req,res){
    const listCourseMost=await courseModel.mostRegis();
    res.json(listCourseMost);
})

router.get('/most-highlight',async function (req,res){
    const listCourseMost=await courseModel.mostHighLight();
    res.json(listCourseMost);
})

router.get('/:id/information',async function (req,res){
    const id=req.params.id;
    const inforCourse=await courseModel.informationCourse(id);
    //const sameCategoryCourseMostBuy=await courseModel.mostBuySameCategory(id);
    res.json(inforCourse);
})

router.get('/:id/same-category-most-buy',async function (req,res){
    const id=req.params.id;
    //const inforCourse=await courseModel.informationCourse(id);
    const sameCategoryCourseMostBuy=await courseModel.mostBuySameCategory(id);
    res.json(sameCategoryCourseMostBuy);
})
module.exports=router;