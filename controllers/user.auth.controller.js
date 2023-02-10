require("dotenv").config();
const sql = require("mysql2");
const bcrypt = require("bcrypt");
const { dbConfig } = require("../configs/dbConfig");
const utils = require("../utils/utils");

const saltRounds = 10;
const emailRegex = /\S+@\S+\.\S+/;

function registerUser(req, res) {
  if (req.body.hasOwnProperty("email") && req.body.hasOwnProperty("password")) {
    // mandatory requirements are fulfilled
    const userData = {
      email: req.body.email.toLowerCase().trim(),
      hash: bcrypt.hashSync(req.body.password.trim(), saltRounds),
      name: req.body.name ? req.body.name.trim() : null,
      userName: req.body.username ? req.body.username.trim() : null,
    };
    //
    if (
      emailRegex.test(userData.email) &&
      userData.email.split(" ").length === 1 //to ensure that no whitespace is present in between
    ) {
      // email is valid
      // fetch the usernames and emails from the database and check if it exists
      const connection = sql.createConnection(dbConfig);

      connection.connect();
      const query = `SELECT email FROM users WHERE email = '${userData.email}';`;

      connection.query(query, (err, rows, fields) => {
        if (err) {
          res.json({ error: err });
        } else {
          if (rows.length === 0) {
            // email is new, i.e. unique; proceed further
            //check for unique username
            if (userData.userName) {
              const connection = sql.createConnection(dbConfig);
              connection.connect();
              const query = `SELECT userName FROM users WHERE userName = '${userData.userName}';`;

              connection.query(query, (err, rows, fields) => {
                if (err) {
                  res.json({ error: err });
                } else {
                  if (rows.length === 0) {
                    // username is new, i.e. unique; proceed further
                    const connection = sql.createConnection(dbConfig);
                    connection.connect();
                    const name = userData.name ? `'${userData.name}'` : null;
                    const username = userData.userName
                      ? `'${userData.userName}'`
                      : null;
                    const query = `INSERT INTO users (name, email, userName, password) VALUES (${name} , '${userData.email}'  , ${username} , '${userData.hash}') ;`;
                    connection.query(query, (err, rows, fields) => {
                      if (err) {
                        res.json({ error: err });
                      } else {
                        res.json({
                          message: "you are successfully registered.",
                        });
                      }
                    });
                    connection.end();
                  } else {
                    //email or username s already
                    res.json({
                      error: `username '${userData.userName}' already exists.`,
                    });
                  }
                }
              });
            } else {
              // insert without username
              const connection = sql.createConnection(dbConfig);
              connection.connect();
              const name = userData.name ? `'${userData.name}'` : null;
              const query = `INSERT INTO users (name, email, password) VALUES (${name} , '${userData.email}' , '${userData.hash}') ;`;
              connection.query(query, (err, rows, fields) => {
                if (err) {
                  res.json({ error: err });
                } else {
                  res.json({
                    message: "you have been successfully registered.",
                  });
                }
              });
              connection.end();
            }
          } else {
            //email or username exists already
            res.json({
              error: `email '${userData.email}' already exists.`,
            });
          }
        }
      });

      connection.end();
    } else {
      res.status(400).json({ error: `email '${userData.email}' is invalid.` });
    }
  } else {
    res.status(400).json({
      error: "email or password is missing. try again.",
      youPosted: req.body,
    });
  }
}

function loginUser(req, res) {
  // check if the body contains email or password or both
  if (
    req.body.hasOwnProperty("username") &&
    req.body.hasOwnProperty("password")
  ) {
    const userName = req.body.username.trim();
    // fetch the row with either matching username or password
    const connection = sql.createConnection(dbConfig);
    connection.query(
      `SELECT userName, email, password, role FROM users WHERE email = '${userName.toLowerCase()}';`,
      (err, rows, fields) => {
        if (err) {
          res.json({ error: err });
        } else {
          // no errors, proceed further
          if (rows.length === 1) {
            // email matches
            utils.sendJWT(rows, req, res);
          } else {
            //email does not match; check with userName
            const connection = sql.createConnection(dbConfig);
            connection.query(
              `SELECT userName, email, password, role FROM users WHERE userName = '${userName}';`,
              (err, rows, fields) => {
                if (err) {
                  res.json({ error: err });
                } else {
                  if (rows.length === 1) {
                    ///
                    //credentials exist with a matching username
                    utils.sendJWT(rows, req, res);
                  } else {
                    // record does not exist.
                    res.json({
                      error: "these credentials do not exist.",
                    });
                  }
                }
              }
            );
          }
        }
      }
    );
    connection.end();
  } else {
    // username or password is not present in the obj; throws error
    res.json({ error: "the body is missing username or password." });
  }
}

module.exports = { registerUser, loginUser };
