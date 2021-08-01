const express = require('express');
const router = express.Router();

const courseOrderModel = require('./../models/course_order.model');

router.get('/', async (req, res) => {
    const filter = req.query;
    const result = await courseOrderModel.all(filter);
    if (result.totalPage === 0) {
        return res.status(204).json();
    }
    return res.json(result);
})

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const userId = req.accessTokenPayload.userId;
    const order = await courseOrderModel.single(id, userId);
    if (order === null) {
        return res.status(204);
    }
    return res.json(order);
});
router.post('/', async (req,res) => {
    // console.log("id user post", req.accessTokenPayload.userId);
    const order = {
        course_id: req.body.courseId,
        user_id: req.accessTokenPayload.userId,
        enroll_at: new Date(),
        status: 0
    }
    try{
        const o = await courseOrderModel.add(order);
        return res.json();
    }catch{
        return res.status(400).json({message: "course buy fail"});
    }


} )

router.put('/:id', async (req, res) => {
    const id = req.params.id * 1 || 0;
    const data = req.body;
    const result = await courseOrderModel.update(id, data);
    if (result == null) res.status(400).json({ message: "Order is exist" });
    if (result > 0) res.status(200).json({ message: result + " row change" });
    else res.status(202).json({ message: "No change" });
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const order = await courseOrderModel.single(id);
    if (order === null) {
        return res.status(204);
    }
    await courseOrderModel.delete(id);
    return res.json();
});


module.exports = router;