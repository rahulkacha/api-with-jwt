require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

module.exports = { sendJWT };
