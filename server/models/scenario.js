const mongoose = require("mongoose");

const scenarioSchema = new mongoose.Schema({
  scenarioName: {
    type: String,
    required: true,
  },
  scenarioDescription: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Scenario", scenarioSchema);
