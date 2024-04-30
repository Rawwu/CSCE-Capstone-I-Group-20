const mongoose = require("mongoose");
const { type } = require("os");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
