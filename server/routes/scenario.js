const express = require("express");
const router = express.Router();
const Scenario = require("../models/scenario");

// Getting all scenarios
router.get("/", async (req, res) => {
  try {
    const scenarios = await Scenario.find();
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
