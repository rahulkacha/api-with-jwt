require("dotenv").config();
const bcrypt = require("bcrypt");
const utils = require("../utils/utils");
const { messages } = require("../helpers/messages");

const connection = require("../configs/database");

const saltRounds = 10;
const emailRegex = /\S+@\S+\.\S+/;

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
            .status(401)
            .json({ error: req.body.username + messages["NOT_REGISTERED"] });
        }
      }
    );
  } else return res.json({ error: messages["MISSING_VAL"] });
}
module.exports = { loginUser };
