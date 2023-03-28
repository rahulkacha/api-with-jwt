require("dotenv").config();
const utils = require("../utils/utils");
const { messages } = require("../helpers/messages");

const connection = require("../configs/database");

function loginUser(req, res) {
  // check if the body contains email or password or both
  userObj = {
    email: req.body.email ? req.body.email.trim().toLowerCase() : null,
    password: req.body.password ? req.body.password.trim() : null,
  };

  // fetch the row with either matching email
  if (userObj.email && userObj.password) {
    connection.query(
      `SELECT * FROM users WHERE email = ?;`,
      userObj.email,
      (err, rows, fields) => {
        if (err) return res.json({ error: err });

        if (rows.length !== 0) {
          return utils.sendJWT(rows, userObj.password, res);
        } else {
          return res
            .status(401)
            .json({ error: req.body.email + messages["NOT_REGISTERED"] });
        }
      }
    );
  } else return res.json({ error: messages["MISSING_VAL"] });
}
module.exports = { loginUser };
