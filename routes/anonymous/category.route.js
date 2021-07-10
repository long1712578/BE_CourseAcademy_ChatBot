const express=require('express');
const modelCategory=require('../../model/anonymous/category.model');

const router=express.Router();

router.get('/',async function (req,res){
    const listCategory=await modelCategory.all();
    res.json(listCategory);
})

module.exports=router;