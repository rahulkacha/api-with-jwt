require("dotenv").config();
const sql = require("mysql2");
const bcrypt = require("bcrypt");
const connection = require("../configs/database");

const { messages } = require("../helpers/messages");

// constructor
const User = function (user) {
  this.user_name = user.username;
  this.user_phone_no = user.phone;
  this.user_password = user.passwordHash;
  this.user_password_f_sweet = user.password;
  this.user_role = user.role;
  this.email = user.email;
};

User.create = (newUser, result) => {
  connection.query("INSERT INTO users SET ? ;", newUser, (err, rows) => {
    if (err) {
      return result({ error: messages[err["code"]] }); // returns err and null
    }
    result(null, { message: messages["REG_SUCCESSFUL"], credentials: newUser });
  });
};

User.selectAll = (role, result) => {
  const queryStr = role
    ? `SELECT * FROM users WHERE is_delete = 0 AND user_role = ${role}`
    : `SELECT * FROM users WHERE is_delete = 0`;
  connection.query(queryStr, (err, users) => {
    if (err) {
      return result(err, null);
    } else {
      return result({ users });
    }
  });
};

User.findById = (id, result) => {
  connection.query(
    "SELECT * FROM users WHERE user_id = ?;",
    id,
    (err, rows) => {
      if (err) return result(err, null);
      if (!rows.length) return result({ error: messages["NOT_FOUND"] + id });

      return result(rows[0]);
    }
  );
};

User.findByIdAndUpdate = (id, userObj, result) => {
  connection.query(
    "UPDATE users SET ? WHERE user_id = ?;",
    [userObj, id],
    (err, rows) => {
      if (err) return result(err, null);

      if (rows.affectedRows !== 0) {
        // checks whether a record with corresponding user_id exists or not
        return result({ message: messages["SUCCESSFUL"] });
      }

      return result({ error: messages["NOT_FOUND"] + id });
    }
  );
};

User.findByIdAndDelete = (id, result) => {
  connection.query(
    "UPDATE users SET is_delete = Abs(is_delete -1) WHERE user_id = ?;",
    id,
    (err, rows) => {
      if (err) return result(err, null);

      if (rows.affectedRows !== 0) {
        // checks whether a record with corresponding user_id exists or not
        return result({ message: messages["SUCCESSFUL"] });
      }

      return result({ error: messages["NOT_FOUND"] + id });
    }
  );
};

module.exports = { User };
