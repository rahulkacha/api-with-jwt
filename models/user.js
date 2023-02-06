const mongoose = require("mongoose");
const moment = require("moment");

// id, name, role, username, email, password, secret_key,  created_at, updated_at

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  username: String,
  password: String,
  createdAt: String,
  updatedAt: [String],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
