const express=require('express');
const courseRoute=require('../../model/anonymous/course.model');

const router=express.Router();

router.get('/',async function (req,res){
    const listCourse=await courseRoute.all();
    res.json(listCourse);
})

router.get('/most-view',async function (req,res){
    const listCourseMost=await courseRoute.mostView();
    res.json(listCourseMost);
})
router.get('/new-course',async function (req,res){
    const listCourseMost=await courseRoute.newCourse();
    res.json(listCourseMost);
})

router.get('/most-regis',async function (req,res){
    const listCourseMost=await courseRoute.mostRegis();
    res.json(listCourseMost);
})

router.get('/most-highlight',async function (req,res){
    const listCourseMost=await courseRoute.mostHighLight();
    res.json(listCourseMost);
})
module.exports=router;