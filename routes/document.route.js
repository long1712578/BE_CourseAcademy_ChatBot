const express = require('express');
const documentModel = require('../models/document.model');
const router = express.Router();

router.get('/', async (req, res) => {
    const result = await documentModel.all();
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
})

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const doc = await documentModel.single(id);
    if (doc === null) {
        return res.status(204);
    }
    return res.json(doc);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id * 1 || 0;
    const data = req.body;
    const result = await documentModel.update(id, data);
    if (result == null) res.status(400).json({ message: "Document is exist" });
    if (result > 0) res.status(200).json({ message: result + " row change" });
    else res.status(202).json({ message: "No change" });
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const document = await documentModel.single(id);
    if (document === null) {
        return res.status(204);
    }
    await documentModel.delete(id);
    return res.json();
})

module.exports = router;