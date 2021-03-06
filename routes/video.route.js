const express = require('express');
const authMdw = require('../middlewares/auth.mdw');
const { multerUpload, isValidFileVideo } = require('../utils/upload');
const videoModel = require('./../models/video.model');
const uploadFileToFirebase = require('../utils/firebase')
const schemaVideo=require('../schemas/video.json');
const router = express.Router();

router.get('/', authMdw, async (req, res) => {
    const filter = req.query;
    const result = await videoModel.all(filter);
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
});

// id is courseId
router.get('/preview/:id', async(req,res) => {
    const courseId = req.params.id;
    const videos = await videoModel.preview(courseId);
    if(videos.length === 0){
        return res.status(400).json("Not video");
    }
    return res.json(videos[0]);
});
// id is coursesId
router.get('/course/:id', authMdw, async(req,res) => {
    const courseId = req.params.id;
    // const idUser = req.accessTokenPayload.userId;
    const videos = await videoModel.preview(courseId);
    if(videos.length === 0){
        return res.status(400).json("Not video");
    }
    return res.json(videos);
})

router.get('/:id', authMdw, async (req, res) => {
    const id = parseInt(req.params.id);
    const video = await videoModel.single(id);
    if (video === null) {
        return res.status(204);
    }
    return res.json(video);
});

// router.post('/', authMdw,  require('../middlewares/validate.mdw')(schemaVideo),multerUpload.single('url'), async (req, res) => {
router.post('/', authMdw,multerUpload.single('url'), async (req, res) => {
    try {
        const data = { ...req.body, is_delete: false };
        if (req.file) {
            if (!isValidFileVideo(req.file.originalname, req.file.mimetype)) {
                return res.status(400).json({ 'message': "Please upload file video type was accepted include mp4, webp, ogg!!" })
            }
            const url = await uploadFileToFirebase(req.file);
            data.url = url;
        }
        const ids = await videoModel.add(data);
        data.id = ids[0];
        const video = await videoModel.single(data.id);
        res.status(200).json(video);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', authMdw, multerUpload.single('url'), async (req, res) => {
    try {
        const id = req.params.id * 1 || 0;
        const data = { ...req.body, is_delete: false };
        if (req.file) {
            if (!isValidFileVideo(req.file.originalname, req.file.mimetype)) {
                return res.status(400).json({ 'message': "Please upload file video type was accepted include mp4, webp, ogg!!" })
            }
            const url = await uploadFileToFirebase(req.file);
            data.url = url;
        }
        const result = await videoModel.update(id, data);
        if (result == null) res.status(400).json({ message: "Video is exist" });
        if (result > 0) res.status(200).json({ message: result + " row change" });
        else res.status(202).json({ message: "No change" });
    } catch (err) {
        res.status(400).json(err);
    }

});

router.delete('/:id', authMdw, async (req, res) => {
    const id = parseInt(req.params.id);
    const document = await videoModel.single(id);
    if (document === null) {
        return res.status(204);
    }
    await videoModel.delete(id);
    return res.json();
})

module.exports = router;