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
      role: +req.body.role || 1, //default is 1, i.e. super Admin
      email:
        emailRegex.test(req.body.email.trim()) &&
        req.body.email.trim().split(" ").length === 1
          ? req.body.email.trim().toLowerCase()
          : null,
      website: req.body.website ? req.body.website.trim() : null,
    });
    // passing the user_id of admin from the decoded JWT
    // User.create(newUser, req.user.user_id, (err, result) => {
    User.create(newUser, 999, (err, result) => {
      if (err) return res.json(err);

      return res.json(result);
    });
  } else {
    return res.json({ error: messages["MISSING_VAL"] });
  }
}

function findAll(req, res) {
  const role = req.query.role ? req.query.role : null;
  User.selectAll(role, (result) => {
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
    user_name: req.body.user_name ? req.body.user_name.trim() : null,
    email: req.body.email ? req.body.email.trim().toLowerCase() : null,
    user_phone_no: req.body.user_phone_no
      ? req.body.user_phone_no.trim()
      : null,
    website: req.body.website ? req.body.website.trim() : null,
  };
  User.findByIdAndUpdate(req.params.id, updateBody, (result) => {
    res.json(result);
  });
}

module.exports = { createUser, findAll, findOne, updateOne, deleteOne };
