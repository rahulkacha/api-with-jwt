const mongoose = require("mongoose");
const moment = require("moment");

// id, name, role, username, email, password, secret_key,  created_at, updated_at

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  username: String,
  password: String,
  secretKey: String,
  createdAt: String,
  updatedAt: [{ type: String }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
