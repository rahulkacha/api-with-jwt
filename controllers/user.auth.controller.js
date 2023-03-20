require("dotenv").config();
const bcrypt = require("bcrypt");
const utils = require("../utils/utils");
const { messages } = require("../helpers/messages");

const connection = require("../configs/database");

const saltRounds = 10;
const emailRegex = /\S+@\S+\.\S+/;

function registerUser(req, res) {
  const userData = {
    email: req.body.email ? req.body.email.toLowerCase().trim() : null,
    password: req.body.password
      ? bcrypt.hashSync(req.body.password.trim(), saltRounds)
      : null,
    name: req.body.name ? req.body.name.trim() : null,
    userName: req.body.username ? req.body.username.trim() : null,
  };

  //
  if (
    emailRegex.test(userData.email) &&
    userData.email.split(" ").length === 1 //to ensure that no whitespace is present in between
  ) {
    // email is valid
    connection.query(
      "INSERT INTO users SET ? ;",
      userData,
      (err, rows, fields) => {
        if (err)
          return res.json({
            error: messages[err.code],
          });

        return res.json({
          message: messages["REG_SUCCESSFUL"],
        });
      }
    );
  } else {
    return res
      .status(400)
      .json({ error: `'${userData.email}' ${messages["INVALID"]}` });
  }
}

function loginUser(req, res) {
  // check if the body contains email or password or both
  userObj = {
    user_name: req.body.username ? req.body.username.trim() : null,
    password: req.body.password ? req.body.password.trim() : null,
  };

  // fetch the row with either matching username or email
  if (userObj.user_name && userObj.password) {
    connection.query(
      `SELECT * FROM users WHERE user_name = ? or email = ?;`,
      [userObj.user_name, userObj.user_name],
      (err, rows, fields) => {
        if (err) return res.json({ error: err });

        if (rows.length !== 0) {
          return utils.sendJWT(rows, userObj.password, res);
        } else {
          return res
            .status(403)
            .json(req.body.username + messages["NOT_REGISTERED"]);
        }
      }
    );
  } else return res.json({ error: messages["MISSING_VAL"] });
}
module.exports = { registerUser, loginUser };
