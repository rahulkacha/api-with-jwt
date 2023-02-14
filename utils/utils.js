require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function sendJWT(rows, passwordStr, res) {
  if (passwordStr !== null) {
    bcrypt.compare(passwordStr, rows[0].password, (err, result) => {
      if (result) {
        // send the token
        const user = {
          username: rows[0].userName,
          email: rows[0].email,
          role: rows[0].role,
        };
        const accessToken = jwt.sign(user, process.env.PRIVATE_KEY, {
          expiresIn: process.env.EXPIRES_IN,
        });
        res.json({ accessToken: accessToken });
      } else {
        res.json({ error: "password does not match" });
      }
    });
  } else {
    res.json({ error: "password can't be null" });
  }
}

module.exports = { sendJWT };
