require("dotenv").config();
const sql = require("mysql2");
const connection = require("../configs/database");

const { messages } = require("../helpers/messages");

// constructor
const Transaction = function (txn) {
  this.from_user_id = txn.from_user_id;
  this.to_user_id = txn.to_user_id;
  this.transaction_amount = txn.transaction_amount;
  this.transaction_other_details = txn.transaction_other_details;
  this.transaction_status = txn.transaction_status;
  this.transaction_category = txn.transaction_category;
  this.transaction_payment_mode = txn.transaction_payment_mode;
  this.added_by = txn.added_by;
};

Transaction.generate = (newTxn, result) => {
  connection.query("INSERT INTO transactions SET ? ;", newTxn, (err, rows) => {
    if (err) {
      return result({ error: messages[err["code"]] }); // returns err and null
    }
    result(null, { message: messages["SUCCESSFUL"], transaction: newTxn });
  });
};

Transaction.selectAll = (result) => {
  const queryStr = `SELECT fu.user_name AS fromUser,
  tu.user_name AS toUser, txn.*
  FROM transactions txn
  INNER JOIN users fu
  ON fu.user_id = txn.from_user_id
  INNER JOIN users tu
  ON tu.user_id = txn.to_user_id;`;
  connection.query(queryStr, (err, txns) => {
    if (err) {
      return result(err, null);
    } else {
      return result({ txns });
    }
  });
};

Transaction.findById = (id, result) => {
  const queryStr = `SELECT fu.user_name AS fromUser,
  tu.user_name AS toUser, txn.*
  FROM transactions txn
  INNER JOIN users fu
  ON fu.user_id = txn.from_user_id
  INNER JOIN users tu
  ON tu.user_id = txn.to_user_id 
  WHERE transaction_id = ?;`;

  connection.query(queryStr, id, (err, rows) => {
    if (err) return result(err, null);
    if (!rows.length) return result({ error: messages["NOT_FOUND"] + id });

    return result(rows[0]);
  });
};

module.exports = { Transaction };
