require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connection = require("../configs/database");
const { messages } = require("../helpers/messages");

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
      } else res.status(401).json({ error: messages["UNAUTHORIZED"] });
    });
  } else res.json({ error: messages["MISSING_VAL"] });
}

function insertTxns(newTxn, newTxn2, result) {
  connection.query(
    `INSERT INTO transactions SET ?; INSERT INTO transactions SET ?;`,
    [newTxn, newTxn2],
    (err, rows) => {
      if (err) {
        return result({ error: messages[err["code"]] });
      }

      return result(null, {
        message: messages["SUCCESSFUL"],
        transactions: [newTxn, newTxn2],
      });
    }
  );
}

module.exports = { sendJWT, insertTxns };
