const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const userTokenSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("UserToken", userTokenSchema);
