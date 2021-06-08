const express = require('express');
const bcrypt = require('bcrypt');

const userModel = require('../Models/user.model');

const router = express.Router();

//signup
router.post('/', async (req, res) => {
    const user = req.body;
    user.is_delete = 1;
    user.password = bcrypt.hashSync(user.password, 10);
    const ids = await userModel.add(user);
    user.id = ids[0];
    delete user.password;

    res.status(201).json(user);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id * 1 || 0;
    const data = req.body;
    const result = await userModel.update(id, data);
    if (result == null) res.status(400).json({ message: "Username is exist" });
    if (result > 0) res.status(200).json({ message: result + " row change" });
    else res.status(202).json({ message: "No change" });
})

//thông tin user
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
//Thay đổi các thông tin: email, họ tên
// router.put('/:id', async function (req, res) {
//     const user = req.body;
//     const id = req.params.id || 0;
//     try {
//         const updateUser = await userModel.updateUser(id, user);
//         console.log(updateUser)
//     } catch {
//         res.status(400).json("Can't update user");
//     }
//
//     res.status(200).json("Update user success with id: " + id);
// })

//Xem danh sách khoá học yêu thích của mình (watchlist)
router.get('/:id/watch-list', async function (req, res) {
    const idUser = req.params.id;
    let watchList;
   // try {
        watchList = await userModel.watchList(idUser)
        console.log(watchList);
    // } catch {
    //     res.status('400').json('Can not get all course ')
    // }
    // if (watchList.length < 1) {
    //     res.status('200').json('Watch list is empty')
    // }
    res.json(watchList);
})

// bỏ thích một khóa học trong watch list params truyền vào idUser và body truyền bào idCourse
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

// thích một khóa học, gọi api truyền xuống body user_id và course_id
router.post('/:id/like-course', async function (req, res) {
    const idUser = req.params.id;
    const idCourse = req.body.course_id;
    try {
        const likeCourse = await userModel.likeCourse(idUser, idCourse);
    } catch {
        res.status(400).json("Can't like this course")
    }
    res.status(200).json("Like success");
})

// Lấy danh sách khóa học đã đăng ký truyền vào params idUser
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

// đăng ký khóa học
router.post('/:id/regis-course', async function (req, res) {
    const idUser = req.params.id;
    const idCourse = req.body.course_id;
    try {
        const likeCourse = await userModel.regisCourse(idUser, idCourse);
    } catch {
        res.status(400).json("Can't regis this course")
    }
    res.status(200).json("Regis success");
})

//tham gia khóa học bằng cách  xem video
router.get('/:id/study-course', async function (req, res) {
    const idUser = req.params.id;
    const idCourse = req.body.course_id;
    let studyCourse;
    try {
        studyCourse = await userModel.studyCourse(idUser, idCourse);
    } catch {
        res.status(400).json("Can't study this course")
    }
    if(studyCourse.length>1)
    {
        res.json(studyCourse);
    }else res.json("Student not regis course")

})

//danh gia khóa học
router.post('/:id/rating-course', async function (req, res) {
    const idUser = req.params.id;
    const idCourse = req.body.course_id;
    const comment = req.body.comment;
    const rating = req.body.rating;
     try {
        const ratingCourse = await userModel.ratingCourse(idUser, idCourse,comment,rating);
     } catch {
         res.status(400).json("Can't rating this course")
     }
    res.status(200).json("Rating this course success")
})

//get user isLike course
router.get('/:id/is-like', async function (req, res) {
    const idUser=req.params.id;
    const idCourse=req.body.course_id;
    let isLike;
    try {
        isLike = await userModel.isLike(idUser,idCourse)
        console.log(isLike)
    } catch {
        res.status(400).json('Can not get status like')
    }
    if(isLike.length>1){
        res.json(true);
    }else res.json(false);
})

module.exports = router;