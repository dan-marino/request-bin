const mongoose = require("mongoose");

const payloadSchema = new mongoose.Schema({
  headers: {
    type: Array,
    required: true,
  },
  rawBody: {
    type: JSON,
    required: true,
  },
});

module.exports = mongoose.model("Payload", payloadSchema);
