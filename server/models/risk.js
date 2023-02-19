const mongoose = require("mongoose");

const riskschema = new mongoose.Schema({
  pid: {
    type: String,
    required: true,
  },
  sid: {
    type: String,
    required: true,
  },
  strategy: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Risk", riskschema);
