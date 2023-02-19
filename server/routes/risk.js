const express = require("express");
const router = express.Router();
const Risk = require("../models/risk");
const Scenario = require("../models/scenario");

// Getting all risks
router.get("/", getAllRisk, (req, res) => {
  res.json(res.risks);
});

async function getAllRisk(req, res, next) {
  try {
    const risks = await Risk.find();
    const filteredScenarios = [];
    for (const risk of risks) {
      const scenario = await Scenario.findById(risk.sid);
      if (scenario) {
        filteredScenarios.push({
          _id: scenario._id,
          scenarioName: scenario.scenarioName,
          scenarioDescription: scenario.scenarioDescription,
          rid: risk._id,
          strategy: risk.strategy,
          pid: risk.pid,
        });
      }
    }
    res.risks = filteredScenarios;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Creating a new risk
router.post("/create", async (req, res) => {
  const risk = new Risk({
    pid: req.body.pid,
    sid: req.body.sid,
  });
  try {
    const newRisk = await risk.save();
    res.status(201).json(newRisk);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting a risk
router.delete("/:id", getRisk, async (req, res) => {
  try {
    await res.risk.remove();
    res.json({ message: "Risk is deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Updating a risk
router.patch("/:id", getRisk, async (req, res) => {
  if (req.body.strategy != null) {
    res.risk.strategy = req.body.strategy;
  }
  try {
    const updatedRisk = await res.risk.save();
    res.json(updatedRisk);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getRisk(req, res, next) {
  let risk;
  try {
    risk = await Risk.findById(req.params.id);
    if (risk == null) {
      return res.status(400).json({ message: "Cannot find risk" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.risk = risk;
  next();
}

module.exports = router;
