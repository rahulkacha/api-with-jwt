require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");

dbUrl = "mongodb://127.0.0.1/apidb";

mongoose.set("strictQuery", false);
mongoose.connect(dbUrl);

function loginUser(req, res) {
  const user = {
    username: req.body.username,
  };
  const accessToken = jwt.sign(user, process.env.PRIVATE_KEY);
  res.json({ accessToken: accessToken });
}

module.exports = { loginUser };
