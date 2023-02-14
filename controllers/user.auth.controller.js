require("dotenv").config();
const sql = require("mysql2");
const bcrypt = require("bcrypt");
const { dbConfig } = require("../configs/dbConfig");
const utils = require("../utils/utils");

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
    const connection = sql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      "INSERT INTO users SET ? ;",
      userData,
      (err, rows, fields) => {
        if (err) {
          res.json({ error: err.sqlMessage });
        } else {
          res.json({
            message: "you have been successfully registered.",
          });
        }
      }
    );
    connection.end();
  } else {
    res.status(400).json({ error: `email '${userData.email}' is invalid.` });
  }
}

function loginUser(req, res) {
  // check if the body contains email or password or both
  userObj = {
    userName: req.body.username ? req.body.username.trim() : null,
    email: req.body.username ? req.body.username.trim().toLowerCase() : null,
    password: req.body.password ? req.body.password.trim() : null,
  };
  // fetch the row with either matching username or password
  const connection = sql.createConnection(dbConfig);
  connection.query(
    `SELECT * FROM users WHERE email = ? OR userName = ?;`,
    [userObj.email, userObj.userName],
    (err, rows, fields) => {
      if (err) {
        res.json({ error: err });
      } else {
        utils.testSendJWT(rows, userObj.password, res);
      }
    }
  );
  connection.end();
}
module.exports = { registerUser, loginUser };
