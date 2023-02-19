const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Getting one user
router.post("/", getUserByEmailAndPassword, (req, res) => {
  res.json(res.user);
});

async function getUserByEmailAndPassword(req, res, next) {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email, password });
    if (user == null) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

// Getting all project manager
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const filteredUsers = users.filter((user) => !user.privilege);
    const userObjects = filteredUsers.map((user) => {
      return { name: user.name, _id: user._id };
    });
    res.json(userObjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
