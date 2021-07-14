const express = require("express");

const fieldModel = require("../models/course_field.model");
const courseModel = require("../models/course.model");

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await fieldModel.all();
  if (result.totalPage === 0) {
    return res.status(204).json();
  }
  return res.json(result);
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const field = await fieldModel.single(id);
  if (field === null) {
    return res.status(204);
  }
  return res.json(field);
});

// add field
router.post("/", async (req, res) => {
  const name = req.body.name;
  const { image = null } = req.body.image;
  var field = {
    name: name,
    image: image,
  };
  var id = await fieldModel.add(field);
  res.status(201).json({ id });
});
// delete Field
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const field = await fieldModel.single(id);
  if (field === null) {
    res.status(400).json({ message: "Delete fail because fail not exist!!!" });
  }
  const courses = await courseModel.getCoursesByFieldId(id);
  if (courses.length === 0) {
    res
      .status(400)
      .json({ message: "Delete fail because Field had course!!!" });
  }
  await fieldModel.delete(id);
  return res.json();
});
// update Field
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const field = await fieldModel.single(id);
  if (!field) {
    return res.status(400).json({ message: "Field no exist" });
  }
  const fieldUpdate = req.body;
  await fieldModel.update(id, fieldUpdate);
  return res.json();
});
module.exports = router;
