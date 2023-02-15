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
};

User.create = (newUser, result) => {
  connection.query("INSERT INTO users SET ? ;", newUser, (err, rows) => {
    if (err) {
      console.log(err);
      result(err, null); // returns err and null
      return;
    }
    result(null, { message: messages["REG_SUCCESSFUL"], credentials: newUser });
  });
};

User.selectAll = (result) => {
  connection.query("SELECT * FROM users;", (err, users) => {
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

User.findByIdAndDelete = (id, result) => {
  connection.query(
    "UPDATE users SET is_delete = Abs(is_delete -1) WHERE user_id = ?;",
    id,
    (err, rows) => {
      if (err) return result(err, null);

      return result({ message: messages["SUCCESSFUL"] });
    }
  );
};

module.exports = { User };
