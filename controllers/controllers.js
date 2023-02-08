require("dotenv").config();
const jwt = require("jsonwebtoken");
const sql = require("mysql2");
const bcrypt = require("bcrypt");
const { dbConfig } = require("../configs/dbConfig");

const saltRounds = 10;
const expiresIn = "15s"; //token expiration time
const emailRegex = /\S+@\S+\.\S+/;

function registerUser(req, res) {
  const data = req.body;
  const email = data.email.toLowerCase().trim();
  const name = `${data.fname.toLowerCase().trim()} ${data.lname
    .toLowerCase()
    .trim()}`;
  const userName = data.username.trim();
  const role = data.hasOwnProperty("role") ? data.role.trim() : "normal";

  if (emailRegex.test(email)) {
    // email is valid
    // fetch the usernames and emails from the database and check if it exists
    const connection = sql.createConnection(dbConfig);

    connection.connect();
    const query = `SELECT email, userName FROM users WHERE userName = '${userName}' OR email = '${email}';`;

    connection.query(query, (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        if (rows.length === 0) {
          // username is new, i.e. unique; proceed further
          bcrypt.hash(data.password.trim(), saltRounds, (err, hash) => {
            const connection = sql.createConnection(dbConfig);
            connection.connect();
            // insert the user credentials into the database
            const query = `INSERT INTO users (name, email, userName, password, role) VALUES ('${name}', '${email}', '${userName}', '${hash}', '${role}');`;

            connection.query(query, (err, rows, fields) => {
              if (err) {
                res.json({ error: err });
              } else {
                res.status(200).json({
                  response: {
                    message: "registered successfully.",
                    credentials: {
                      name: name,
                      email: email,
                      username: userName,
                      role: role,
                    },
                  },
                });
              }
            });

            connection.end();
          });
        } else {
          //email or username exist already
          res.json({
            error: `either username: '${userName}' or email: '${email}' already exist.`,
          });
        }
      }
    });

    connection.end();
  } else {
    res.json({ error: `email: '${email}' is invalid.` });
  }
}

function loginUser(req, res) {
  // check if the body contains email or password or both
  if (req.body.hasOwnProperty("email")) {
    query = `SELECT userName, email, password, role FROM users WHERE email = '${req.body.email
      .toLowerCase()
      .trim()}';`;
  } else if (req.body.hasOwnProperty("username")) {
    query = `SELECT userName, email, password, role FROM users WHERE userName = '${req.body.username.trim()}';`;
  } else {
    // neither email or username is present in the obj; throws error
    res.json({ error: "the body does not contain email or username" });
  }
  if (req.body.hasOwnProperty("password")) {
    //contains password
    // fetch the row with either matching username or password
    const connection = sql.createConnection(dbConfig);

    connection.query(query, (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        if (rows.length === 1) {
          bcrypt.compare(
            req.body.password.trim(),
            rows[0].password,
            (err, result) => {
              if (result) {
                // send the token
                const user = {
                  username: rows[0].userName,
                  email: rows[0].email,
                  role: rows[0].role,
                };

                //
                const accessToken = jwt.sign(user, process.env.PRIVATE_KEY, {
                  expiresIn: expiresIn,
                });
                res.json({ accessToken: accessToken });
              } else {
                res.json({ error: "password does not match" });
              }
            }
          );
        } else {
          res.json({ error: "these credentials does not exist." });
        }
      }
    });

    connection.end();
  } else {
    res.json({ error: "the body does not contain password." });
  }
}

module.exports = { loginUser, registerUser };
