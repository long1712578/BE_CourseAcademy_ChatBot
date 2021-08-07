const express = require('express');
const authMdw = require('../middlewares/auth.mdw');

const courseModel = require('../Models/course.model');
const fs = require("fs");
const formidable = require("formidable");
const mv = require("mv");

const { isValidFileVideo, getExtension, isValidFileDocument, multerUpload, isValidFileImage } = require('../utils/upload');
const videoModel = require('./../models/video.model');
const documentModel = require('../models/document.model');
const uploadFileToFirebase = require('../utils/firebase');

const router = express.Router();

router.get('/', async (req, res) => {
    const filter = req.query;
    const result = await courseModel.all(filter);
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
});

router.post('/', authMdw, multerUpload.single('image'), async (req, res) => {
    try {
        const data = { ...req.body, is_delete: false };
        if (req.file) {
            if (!isValidFileImage(req.file.originalname, req.file.mimetype)) {
                return res.status(400).json({ 'message': "Please upload file image type was accepted include png, jpg, jpeg!!" })
            }
            const url = await uploadFileToFirebase(req.file);
            data.image = url;
        }
        const ids = await courseModel.add(data);
        data.id = ids[0];
        const course = await courseModel.single(data.id);
        res.status(200).json(course);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const course = await courseModel.single(id);
    if (course === null) {
        return res.status(204);
    }
    return res.json(course);
});

router.put('/:id', authMdw, multerUpload.single('image'), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = { ...req.body, is_delete: false };
        if (req.file) {
            if (!isValidFileImage(req.file.originalname, req.file.mimetype)) {
                return res.status(400).json({ 'message': "Please upload file image type was accepted include png, jpg, jpeg!!" })
            }
            const url = await uploadFileToFirebase(req.file);
            data.image = url;
        }
        const result = await courseModel.update(id, data);
        if (result == null) res.status(400).json({ message: "Course is exist" });
        if (result > 0) res.status(200).json({ message: result + " row change" });
        else res.status(202).json({ message: "No change" });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', authMdw, async (req, res) => {
    const id = parseInt(req.params.id);
    const course = await courseModel.single(id);
    if (course === null) {
        return res.status(204);
    }
    await courseModel.delete(id);
    return res.json();
});

router.post('/:id', authMdw, async (req, res) => {
    console.log("route add course");
    return res.status(200);
});

router.post('/:id/upload-video', authMdw, async (req, res) => {
    const form = formidable({ multiples: true, keepExtensions: true });
    const courseId = req.params.id;

    let promise = new Promise((resolve, reject) => {

        form.onPart = (part) => {
            if (!isValidFileVideo(part.filename, part.mime)) {
                reject({ 'message': "Please upload upload video file type was accepted include mp4, webpm, ogg!!" });
            }
            form.handlePart(part);
        }
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(404).json({ message: err });
            }

            let file = Object.values(files)[0];
            const randomFileName = new Date().getTime() + "." + getExtension(file.name);
            const dir = __dirname + dirVideoUpload + courseId;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            mv(file.path, dir + '/' + randomFileName, (err) => {
                reject(new Error({ message: "Cannot move file" }));
            });
            videoData.push({ name: randomFileName, course_id: courseId, url: dir });

            resolve(videoData);
        });
    });

    promise.then(async (data) => {
        if (data) {
            const videos = await videoModel.add(data);
            if (videos)
                res.status(201).json({ message: "Add video successfully", video: videos });
            else
                throw new Error({ message: "Add video failed" });
        }
    }).catch(err => {
        res.status(400).json({ message: err.message })
    })

});

router.post('/:id/upload-document', authMdw, async (req, res) => {
    const form = formidable({ multiples: true, keepExtensions: true });
    const courseId = req.params.id;

    let promise = new Promise((resolve, reject) => {
        let documentData = [];

        form.onPart = (part) => {
            if (!isValidFileDocument(part.filename, part.mime)) {
                reject({ 'message': "Please upload upload document file type was accepted include txt, doc, pdf!!" });
            }
            form.handlePart(part);
        }


        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(404).json({ message: err });
            }

            let file = Object.values(files)[0];

            const randomFileName = new Date().getTime() + "." + getExtension(file.name);
            const dir = __dirname + dirDocumentUpload + courseId;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            mv(file.path, dir + '/' + randomFileName, (err) => {
                reject(new Error({ message: "Cannot move file" }));
            });

            documentData.push({ name: randomFileName, course_id: courseId, url: dir });

            resolve(documentData);
        });
    });

    promise.then(async (data) => {
        if (data) {
            const documents = await documentModel.add(data);
            if (documents)
                res.status(201).json({ message: "Add document successfully", documents: documents });
            else
                throw new Error({ message: "Add document failed" });
        }
    }).catch(err => {
        res.status(400).json({ message: err.message })
    })

});

module.exports = router;