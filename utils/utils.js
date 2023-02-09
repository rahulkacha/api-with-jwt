require("dotenv").config();
const jwt = require("jsonwebtoken");
const sql = require("mysql2");
const bcrypt = require("bcrypt");
const { dbConfig } = require("../configs/dbConfig");
const utils = require("../utils/utils");

const saltRounds = 10;
const emailRegex = /\S+@\S+\.\S+/;

function insertQuery(queryString) {
  const connection = sql.createConnection(dbConfig);
  connection.connect();
  // insert the user credentials into the database

  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      return { status: false, error: err };
    } else {
      return {
        status: true,
        response: {
          message: "registered successfully.",
          credentials: {
            name: userData.name,
            email: userData.email,
            username: userData.userName,
            role: role,
          },
        },
      };
    }
  });

  connection.end();
}

function sendJWT(rows, reqObj, resObj) {
  bcrypt.compare(
    reqObj.body.password.trim(),
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
          expiresIn: process.env.EXPIRES_IN,
        });
        resObj.json({ accessToken: accessToken });
      } else {
        resObj.json({ error: "password does not match" });
      }
    }
  );
}

module.exports = { insertQuery, sendJWT };
