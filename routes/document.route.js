const express = require('express');
const authMdw = require('../middlewares/auth.mdw');
const documentModel = require('../models/document.model');
const uploadFileToFirebase = require('../utils/firebase');
const { isValidFileDocument, multerUpload } = require('../utils/upload');
const router = express.Router();

router.get('/', authMdw, async (req, res) => {
    const filter = req.query;
    const result = await documentModel.all(filter);
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
});

// id is courseId
router.get('/preview/:id', async(req,res) => {
    const courseId = req.params.id;
    const documents = await documentModel.preview(courseId);
    if(documents.length === 0){
        return res.status(400).json("Not document");
    }
    return res.json(documents[0]);
});

router.post('/', authMdw, multerUpload.single('url'), async (req, res) => {
    try {
        const data = { ...req.body, is_delete: false };
        if (req.file) {
            if (!isValidFileDocument(req.file.originalname, req.file.mimetype)) {
                return res.status(400).json({ 'message': "Please upload file document type was accepted include doc, pdf, txt!!" })
            }
            const url = await uploadFileToFirebase(req.file);
            data.url = url;
        }
        const ids = await documentModel.add(data);
        data.id = ids[0];
        const doc = await documentModel.single(data.id);
        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', authMdw, multerUpload.single('url'), async (req, res) => {
    try {
        const id = req.params.id * 1 || 0;
        const data = { ...req.body, is_delete: false };
        if (req.file) {
            if (!isValidFileDocument(req.file.originalname, req.file.mimetype)) {
                return res.status(400).json({ 'message': "Please upload file document type was accepted include doc, pdf, txt!!" })
            }
            const url = await uploadFileToFirebase(req.file);
            data.url = url;
        }
        const result = await documentModel.update(id, data);
        if (result == null) res.status(400).json({ message: "Document is exist" });
        if (result > 0) res.status(200).json({ message: result + " row change" });
        else res.status(202).json({ message: "No change" });
    } catch (err) {
        res.status(400).json(err);
    }

});

router.get('/:id', authMdw, async (req, res) => {
    const id = parseInt(req.params.id);
    const doc = await documentModel.single(id);
    if (doc === null) {
        return res.status(204);
    }
    return res.json(doc);
});


router.delete('/:id', authMdw, async (req, res) => {
    const id = parseInt(req.params.id);
    const document = await documentModel.single(id);
    if (document === null) {
        return res.status(204);
    }
    await documentModel.delete(id);
    return res.json();
})

module.exports = router;