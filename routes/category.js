const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const categorys = await Category.find({});

  if (!categorys) {
    res.send("no categorys found!");
  }
  res.send(categorys);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  const category = await Category.findById(id);
  if (!category) {
    res.status(400).send("this category not found please check the id again");
  } else {
    res.status(200).send(category);
  }
});

router.post("/", async (req, res) => {
  let prod = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  await prod.save();
  res.send(prod);
});

router.put("/:id", async (req, res) => {
  let id = req.params.id;
  const category = await Category.findByIdAndUpdate(id, {
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
  });
  if (!category) {
    res.status(400).send("this category not found please check the id again");
  } else {
    res.status(200).send(category);
  }
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let cat = await Category.findByIdAndRemove(id);
  if (!cat) {
    res.status(404).json({ success: false, message: "Category not found!" });
  } else {
    res.status(200).json({ success: true, message: "Category is deleted!" });
  }
});

module.exports = router;
