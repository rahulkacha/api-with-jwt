require("dotenv").config();
const sql = require("mysql2");
const bcrypt = require("bcrypt");
const { dbConfig } = require("../configs/dbConfig");
const utils = require("../utils/utils");

const saltRounds = 10;
const emailRegex = /\S+@\S+\.\S+/;

// function registerUser(req, res) {
//   const data = req.body;
//   const email = data.email.toLowerCase().trim();
//   const name = `${data.fname.toLowerCase().trim()} ${data.lname
//     .toLowerCase()
//     .trim()}`;
//   const userName = data.username.trim();
//   const role = data.hasOwnProperty("role") ? data.role.trim() : "normal";

//   if (emailRegex.test(email)) {
//     // email is valid
//     // fetch the usernames and emails from the database and check if it exists
//     const connection = sql.createConnection(dbConfig);

//     connection.connect();
//     const query = `SELECT email, userName FROM users WHERE userName = '${userName}' OR email = '${email}';`;

//     connection.query(query, (err, rows, fields) => {
//       if (err) {
//         throw err;
//       } else {
//         if (rows.length === 0) {
//           // username is new, i.e. unique; proceed further
//           bcrypt.hash(data.password.trim(), saltRounds, (err, hash) => {
//             const connection = sql.createConnection(dbConfig);
//             connection.connect();
//             // insert the user credentials into the database
//             const query = `INSERT INTO users (name, email, userName, password, role) VALUES ('${name}', '${email}', '${userName}', '${hash}', '${role}');`;

//             connection.query(query, (err, rows, fields) => {
//               if (err) {
//                 res.json({ error: err });
//               } else {
//                 res.status(200).json({
//                   response: {
//                     message: "registered successfully.",
//                     credentials: {
//                       name: name,
//                       email: email,
//                       username: userName,
//                       role: role,
//                     },
//                   },
//                 });
//               }
//             });

//             connection.end();
//           });
//         } else {
//           //email or username exist already
//           res.json({
//             error: `either username: '${userName}' or email: '${email}' already exist.`,
//           });
//         }
//       }
//     });

//     connection.end();
//   } else {
//     res.json({ error: `email: '${email}' is invalid.` });
//   }
// }

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

function registerUser(req, res) {
  const data = req.body;
  if (data.hasOwnProperty("email") && data.hasOwnProperty("password")) {
    // mandatory requirements are fulfilled

    const userData = {
      email: data.email.toLowerCase().trim(),
      hash: bcrypt.hashSync(data.password.trim(), saltRounds),
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
            const queryStr = `INSERT INTO users (email, password) VALUES ('${userData.email}', '${userData.hash}');`;

            const connection = sql.createConnection(dbConfig);
            connection.connect();
            // insert the user credentials into the database

            connection.query(queryStr, (err, rows, fields) => {
              if (err) {
                res.json({ error: err });
              } else {
                res.status(200).json({
                  response: "registered successfully.",
                });
              }
            });

            connection.end();
          } else {
            //email or username exist already
            res.json({
              error: `email '${userData.email}' already exist.`,
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
      youPosted: data,
    });
  }
}

module.exports = { loginUser, registerUser };
