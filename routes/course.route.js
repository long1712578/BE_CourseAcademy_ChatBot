const express = require('express');

const courseModel = require('../Models/course.model');
const fs = require("fs");
const sha1 = require("sha1");
const formidable = require("formidable");
const mv = require("mv");

const { isValidFile, getExtension } = require('./../utils/video_upload');
const videoModel = require('./../models/video.model');

const router = express.Router();

router.get('/', async (req, res) => {
    const filter = req.query;
    const result = await courseModel.all(filter);
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
});

router.post('/', async (req, res) => {
    const course = req.body;
    course.is_delete = false;
    const ids = await courseModel.add(course);
    course.id = ids[0];
    res.status(201).json(course);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const course = await courseModel.single(id);
    if (course === null) {
        return res.status(204);
    }
    return res.json(course);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id * 1 || 0;
    const data = req.body;
    const result = await courseModel.update(id, data);
    if (result == null) res.status(400).json({ message: "Course is exist" });
    if (result > 0) res.status(200).json({ message: result + " row change" });
    else res.status(202).json({ message: "No change" });
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const course = await courseModel.single(id);
    if (course === null) {
        return res.status(204);
    }
    await courseModel.delete(id);
    return res.json();
});

router.post('/:id', async (req, res) => {
    console.log("route add course");
    return res.status(200);
});
// router.post('/:id/upload-video', courseController.uploadVideoForCourse);
router.post('/:id/upload-video', async (req, res) => {

    const form = formidable({ multiples: true, keepExtensions: true });

    const courseId = req.params.id;
    // const name = req.body.name;


    let promise = new Promise((resolve, reject) => {
        let videoData = [];

        form.onPart = (part) => {
            if (!isValidFile(part.filename, part.mime)) {
                reject(new Error({ message: "Please upload upload video file type was accepted include mp4, webpm, ogg!!" }));
            }
            form.handlePart(part);
        }


        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(404).json({ message: err });
            }

            let listFile = Object.values(files)[0];
            listFile.forEach(file => {

                const randomFileName = sha1(new Date().getTime()) + "." + getExtension(file.name);
                const dir = __dirname + '/../uploads/' + courseId;
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                mv(file.path, dir + '/' + randomFileName, (err) => {
                    reject(new Error({ message: "Cannot move file" }));
                });

                videoData.push({ name: randomFileName, course_id: courseId, url: dir });
            });
            resolve(videoData);
        });
    });

    promise.then(async (data) => {
        if (data) {
            const videos = await videoModel.add(data);
            if (videos)
                res.status(201).json({ message: "Add video successfully" });
            else
                throw new Error({ message: "Add video failed" });
        }
    }).catch(err => {
        res.status(400).json({ message: err.message })
    })

});

module.exports = router;