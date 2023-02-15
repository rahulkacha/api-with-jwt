const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const { messages } = require("../helpers/messages");
const saltRounds = 10;

function createUser(req, res) {
  if (req.body.username && req.body.phone && req.body.password) {
    const newUser = new User({
      username: req.body.username ? req.body.username.trim() : null,
      phone: req.body.phone ? req.body.phone.trim() : null,
      passwordHash: req.body.password
        ? bcrypt.hashSync(req.body.password.trim(), saltRounds)
        : null,
      password: req.body.password ? req.body.password.trim() : null,
      ///////////////////////
      role: req.body.role ? req.body.role : 1,
    });

    User.create(newUser, (err, result) => {
      if (err) return res.json({ error: err });

      return res.json(result);
    });
  }
}

function findAll(req, res) {
  User.selectAll((result) => {
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

module.exports = { createUser, findAll, findOne, deleteOne };
