require("dotenv").config();
const jwt = require("jsonwebtoken");
const sql = require("mysql2");
const bcrypt = require("bcrypt");
const { dbConfig } = require("../configs/dbConfig");

const saltRounds = 10;
const expiresIn = "15s"; //token expiration time
const emailRegex = /\S+@\S+\.\S+/;

function loginUser(req, res) {
  const user = {
    username: req.body.username,
  };
  const accessToken = jwt.sign(user, process.env.PRIVATE_KEY, {
    expiresIn: expiresIn,
  });
  res.json({ accessToken: accessToken });
}

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
                      //for testing only
                      hash: hash,
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

module.exports = { loginUser, registerUser };
