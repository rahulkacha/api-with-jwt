require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { messages } = require("../helpers/messages");

// function sendJWT(rows, passwordStr, res) {
//   if (passwordStr !== null) {
//     bcrypt.compare(passwordStr, rows[0].password, (err, result) => {
//       if (result) {
//         // send the token
//         const user = {
//           username: rows[0].userName,
//           email: rows[0].email,
//           role: rows[0].role,
//         };
//         const accessToken = jwt.sign(user, process.env.PRIVATE_KEY, {
//           expiresIn: process.env.EXPIRES_IN,
//         });
//         res.json({ accessToken: accessToken });
//       } else res.json({ error: messages["UNAUTHORIZED"] });
//     });
//   } else res.json({ error: messages["MISSING_VAL"]});
// }

function sendJWT(rows, passwordStr, res) {
  if (passwordStr !== null) {
    bcrypt.compare(passwordStr, rows[0].user_password, (err, result) => {
      if (result) {
        // send the token
        const user = {
          username: rows[0].user_name,
          user_role: rows[0].user_role,
          user_id: rows[0].user_id,
        };

        const accessToken = jwt.sign(user, process.env.PRIVATE_KEY, {
          expiresIn: parseInt(process.env.EXPIRES_IN),
        });

        res.json({ accessToken: accessToken });
      } else res.json({ error: messages["UNAUTHORIZED"] });
    });
  } else res.json({ error: messages["MISSING_VAL"] });
}

module.exports = { sendJWT };
