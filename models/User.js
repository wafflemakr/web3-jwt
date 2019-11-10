const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  account: {
    type: String,
    required: true,
    unique: true
  },
  register_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("user", UserSchema);
