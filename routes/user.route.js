const express = require('express');
const bcrypt = require('bcrypt');
var rn = require('random-number');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pdlong578@gmail.com',
        pass: 'long1712578'
    }
});
const jwt = require('jsonwebtoken');
const optSecret = require('../config/auth.config');
const userModel = require('../models/user.model');
const schemaUser = require('../schemas/user.json');
const { multerUpload, isValidFileImage } = require('../utils/upload');
const uploadFileToFirebase = require('../utils/firebase');

const router = express.Router();

router.get('/', async (req, res) => {
    const filter = req.query;
    const result = await userModel.all(filter);
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
});

router.get('/check-username', async (req, res) => {
    const name = req.query.username;
    const user = await userModel.singleByUserName(name);
    if (!user) {
        res.json(name);
    } else {
        res.status(400).json({ message: "username had exist" });
    }
})

//signup
router.post('/', require('../middlewares/validate.mdw')(schemaUser), async (req, res) => {
    const user1 = req.body;
    const user = { ...user1, role_id: 1 };
    console.log('user', user);
    //check email
    if (user.email) {
        let isCheck = false;
        const listEmail = await userModel.getEmailAll();
        for (let e of listEmail) {
            if (e.email === user.email) {
                isCheck = true;
            }
        }
        if (isCheck) {
            res.status(400).json({ message: "The email had exist!" });
        }
        var optcode = jwt.sign({ email: user.email }, optSecret.secret, {
            expiresIn: 30 * 60 // seconds(30 phut)
        });
        user.is_delete = 0;
        user.active = 0; // Cho xac thuc 
        user.password = bcrypt.hashSync(user.password, 10);
        const ids = await userModel.add(user);
        user.id = ids[0];
        delete user.password;
        var mailOptions = {
            from: 'pdlong578@gmail.com',
            to: req.body.email,
            subject: 'Please confirm your account!',
            html: `<h1>Email Confirmation</h1>
        <h2>Hello ${user.fullname || "user"}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:5000/api/sign-up/confirm/${optcode}/user/${ids[0]}> Click here</a>
        </div>`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(400).json({ message: "The email send not success!" })
            } else {
                console.log("thanh cong");
            }
        });
    }

    res.status(201).json(user);
});
router.get('/confirm/:opt/user/:id', async (req, res) => {
    const opt = req.params.opt || null;
    const id = req.params.id;
    try {
        const decode = jwt.verify(opt, optSecret.secret);
        const emailOtp = decode.emailO;
        const email = await userModel.getEmaiById(id);
        if (email.email !== emailOtp) {
            res.status(400).json({ message: "opt is not correct!" });
        } else {
            await userModel.updateOpt(emailOtp);
            res.json();
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }

})

router.put('/:id', multerUpload.single('avatar'), async (req, res) => {
    const id = req.params.id * 1 || 0;
    const data = req.body;
    if (req.file) {
        if (!isValidFileImage(req.file.originalname, req.file.mimetype)) {
            return res.status(400).json({ 'message': "Please upload file image type was accepted include png, jpg, jpeg!!" })
        }
        const url = await uploadFileToFirebase(req.file);
        data.avatar = url;
    }
    const result = await userModel.updateUser(id, data);
    if (result == null) res.status(400).json({ message: "Username is exist" });
    if (result > 0) res.status(200).json({ message: result + " row change" });
    else res.status(202).json({ message: "No change" });
});

router.put('/:id/password', async (req, res) => {
    const id = req.params.id;
    const newPass = req.body.newPass;
    const oldPass = req.body.oldPass;

    const user = await userModel.singleById(id);
    console.log(user);
    //Kiem tra password cu chinh sat khong
    if (!bcrypt.compareSync(oldPass, user.password)) {
        res.status(400).json("Password fail");
    };
    const password = bcrypt.hashSync(newPass, 10);
    const result = await userModel.updateUser(id, { password: password });
    if (result > 0) res.status(200).json({ message: "Chang success" });
    else res.status(400).json({ message: "Change fail" });

})

router.delete('/:id', async (req, res) => {
    const id = req.params.id * 1 || 0;
    const result = await userModel.delete(id);
    if (result == null) res.status(400).json({ message: "User is exist" });
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
    res.json(inforUser[0])

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
router.post('/like-course', async function (req, res) {
    const idUser = req.accessTokenPayload.userId;
    const idCourse = req.body.course_id;
    try {
        const likeCourse = await userModel.likeCourse(idUser, idCourse);
    } catch {
        res.status(400).json("Can't like this course")
    }
    res.status(200).json("Like success");
})
// bỏ thích 1 khoá học
router.delete('/dislike-course/:id', async function (req, res) {
    const idUser = req.accessTokenPayload.userId;
    const idCourse = req.params.id;
    try {
        const likeCourse = await userModel.unLikeCourse(idUser, idCourse);
    } catch {
        res.status(400).json("Can't like this course")
    }
    res.status(200).json("DisLike success");
})

// Lấy danh sách khóa học đã đăng ký truyền vào params idUser
router.get('/:id/list-course-enroll', async function (req, res) {
    const idUser = req.params.id || 0;
    let listCourseEnroll;
    try {
        listCourseEnroll = await userModel.listCourseEnroll(idUser);
    } catch {
        res.status(400).json('Can not get list course enroll');
    }
    if (listCourseEnroll < 1) {
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
    if (studyCourse.length > 1) {
        res.json(studyCourse);
    } else res.json("Student not regis course")

})

//danh gia khóa học
router.post('/:id/rating-course', async function (req, res) {
    const idUser = req.params.id;
    const idCourse = req.body.course_id;
    const comment = req.body.comment;
    const rating = req.body.rating;
    try {
        const ratingCourse = await userModel.ratingCourse(idUser, idCourse, comment, rating);
    } catch {
        res.status(400).json("Can't rating this course")
    }
    res.status(200).json("Rating this course success")
})

//get user isLike course
router.get('/is-like/:course_id', async function (req, res) {

    const idUser = req.accessTokenPayload.userId;
    const idCourse = req.params.course_id;
    let isLike;
    try {
        isLike = await userModel.isLike(idUser, idCourse)
        if (isLike.length > 0) {
            return res.json(true);
        } else {
            return res.json(false);
        }
    } catch {
        res.json(false);
    }
})

router.post('/add-new-user', multerUpload.single('avatar'), async (req, res) => {
    try {
        const data = { ...req.body, is_delete: false };
        data.password = bcrypt.hashSync(data.password, 10);
        console.log(req.file);
        if (req.file) {
            if (!isValidFileImage(req.file.originalname, req.file.mimetype)) {
                return res.status(400).json({ 'message': "Please upload file image type was accepted include png, jpg, jpeg!!" })
            }
            const url = await uploadFileToFirebase(req.file);
            data.avatar = url;
        }
        const ids = await userModel.add(data);
        data.id = ids[0];
        const user = await userModel.singleById(data.id);
        delete user.password;
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;