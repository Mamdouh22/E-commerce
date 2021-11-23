const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const users = await User.find().select("name email phone isAdmin");
  if (!users) {
    res.send("no users found");
  }
  res.send(users);
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    user = await User.findById(id).select("-password");
    res.send(user);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "user cannot find successfully!" });
  }
});

router.get("/user/count", async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    res.status(200).send({ usersCount: usersCount });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "something wrong in users count" });
  }
});

router.post("/register", async (req, res) => {
  try {
    let user = await new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
    });

    user = await user.save();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "user cannot created!" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let user = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
      },
      {
        new: true,
      }
    );

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "user cannot updated!" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    userDel = await User.findByIdAndRemove(id);
    res.send({ success: true, message: "user deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "user cannot deleted successfully!" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const secret = process.env.secret;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send("wrong user");
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      let token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: "7d" }
      );
      res.send({
        email: user.email,
        token: token,
      });
    } else {
      res.status(400).send("password wrong");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something go wrong");
  }
});

module.exports = router;
