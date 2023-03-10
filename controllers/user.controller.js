const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const { messages } = require("../helpers/messages");

const saltRounds = 10;
const emailRegex = /\S+@\S+\.\S+/;

function createUser(req, res) {
  if (
    req.body.username &&
    req.body.phone &&
    req.body.password &&
    req.body.email
  ) {
    const newUser = new User({
      username: req.body.username.trim(),
      phone: req.body.phone.trim(),
      passwordHash: bcrypt.hashSync(req.body.password.trim(), saltRounds),
      password: req.body.password.trim(),
      role: req.body.role || 1,
      email:
        emailRegex.test(req.body.email.trim()) &&
        req.body.email.trim().split(" ").length === 1
          ? req.body.email.trim().toLowerCase()
          : null,
    });

    User.create(newUser, (err, result) => {
      if (err) return res.json(err);

      return res.json(result);
    });
  } else {
    return res.json({ error: messages["MISSING_VAL"] });
  }
}

function findAll(req, res) {
  User.selectAll(req.body.role || null, (result) => {
    res.json(result);
  });
}

function findOne(req, res) {
  User.findById(req.params.id, (result) => {
    res.json(result);
  });
}

function deleteOne(req, res) {
  User.findByIdAndDelete(req.params.id, (result) => {
    res.json(result);
  });
}

function updateOne(req, res) {
  const updateBody = {
    user_phone_no: req.body.phone ? req.body.phone.trim() : null,
  };
  User.findByIdAndUpdate(req.params.id, updateBody, (result) => {
    res.json(result);
  });
}

module.exports = { createUser, findAll, findOne, updateOne, deleteOne };
