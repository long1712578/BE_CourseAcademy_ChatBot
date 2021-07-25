const express = require('express');
const rateModel = require('../models/rating.model');

const router = express.Router();


router.get('/course/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const cmds = await rateModel.getComment(page, id);
    if (cmds === null) {
        return res.status(204);
    }
    return res.json(cmds);
});

// router.get('/:useId/course/:courseId', async(req,res) => {
//     const userId = parseInt(req.params.useId);
//     const courseId = parseInt(req.params.courseId);

//     const cmd = await rateModel.single(userId, courseId);
//     console.log('cmd', cmd);
// });

// add category
router.post('/', async (req, res) => {
    const comment = req.body.comment;
    const useId = req.body.userId;
    const courseId = req.body.courseId;
    const rating = req.body.rating || null;
    const last_update = new Date();
    const cmdCheck = await rateModel.single(useId, courseId);
    if (cmdCheck.length > 0){
        if(cmdCheck[0].rating){
            return res.status(400).json({message: "You had review!!!"});
        }else if(rating){
            // update
            await rateModel.update(useId, courseId, rating);
            return res.json();
        }else{
            return res.status(400).json({message: "You had review!!!"});
        }
    }
    console.log("course", useId, "course", courseId);
    const cmd = {
        comment,
        user_id: useId,
        course_id: courseId,
        create_at: last_update,
        rating
    }
    var newcmd = await rateModel.add(cmd);
    const cmd1 = await rateModel.single(useId, courseId);
    res.status(201).json(cmd1);
});
// // delete category
// router.delete('/:id', async (req, res) => {
//     const id = parseInt(req.params.id);
//     const category = await categoryModel.single(id);
//     console.log(category);
//     if (category === null) {
//         return res.status(204).json({ message: 'Delete fail because category not exist!!!' });
//     }
//     const courses = await courseModel.getCoursesByCategoryId(id);
//     if (courses.length === 0) {
//         return res.status(204).json({ message: 'Delete fail bacause category had courses!!!' })
//     }
//     await categoryModel.delete(id);
//     return res.json();
// });
// // update category
// router.put('/:id', async (req, res) => {
//     const id = parseInt(req.params.id);
//     const name = req.body.name;
//     const result = await categoryModel.update(id, name);
//     if (result === null) {
//         return res.status(400).json();
//     }
//     return res.json();
// })
module.exports = router;