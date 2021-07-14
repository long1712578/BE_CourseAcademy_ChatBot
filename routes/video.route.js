const express = require('express');
const videoModel = require('./../models/video.model');

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await videoModel.all();
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
})

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const video = await videoModel.single(id);
    if (video === null) {
        return res.status(204);
    }
    return res.json(video);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id * 1 || 0;
    const data = req.body;
    const result = await videoModel.update(id, data);
    if (result == null) res.status(400).json({ message: "Video is exist" });
    if (result > 0) res.status(200).json({ message: result + " row change" });
    else res.status(202).json({ message: "No change" });
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const document = await videoModel.single(id);
    if (document === null) {
        return res.status(204);
    }
    await videoModel.delete(id);
    return res.json();
})

module.exports = router;