const fs = require("fs");
const sha1 = require("sha1");
const formidable = require("formidable");
const mv = require("mv");

const { isValidFile, getExtension } = require('./../utils/video_upload.js');
const videoModel = require('../models/video.model');

module.exports = {
    async uploadVideoForCourse(req, res) {
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
    }
}