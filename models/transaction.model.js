require("dotenv").config();
const moment = require("moment");
const connection = require("../configs/database");
const utils = require("../utils/utils");
const { messages } = require("../helpers/messages");

// constructor
const Transaction = function (txn) {
  this.from_user_id = txn.from_user_id;
  this.to_user_id = txn.to_user_id;
  this.transaction_amount = Number(txn.transaction_amount);
  this.transaction_other_details = txn.transaction_other_details;
  this.transaction_status = txn.transaction_status;
  this.transaction_category = txn.transaction_category;
  this.transaction_payment_mode = txn.transaction_payment_mode;
  this.added_by = txn.added_by;
  this.balance = Number(txn.transaction_amount) * -1;
};

Transaction.selectAll = (result) => {
  const queryStr = `SELECT fu.user_name AS fromUser,
  tu.user_name AS toUser, txn.*
  FROM transactions txn
  INNER JOIN users fu
  ON fu.user_id = txn.from_user_id
  INNER JOIN users tu
  ON tu.user_id = txn.to_user_id;`;
  connection.query(queryStr, (err, transactions) => {
    if (err) {
      return result(err, null);
    } else {
      return result({ transactions });
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

Transaction.generate = (newTxn, result) => {
  const newTxn2 = {
    from_user_id: newTxn.to_user_id,
    to_user_id: newTxn.from_user_id,
    transaction_amount: newTxn.transaction_amount,
    transaction_other_details: newTxn.transaction_other_details,
    transaction_status: newTxn.transaction_status,
    transaction_category: newTxn.transaction_category,
    transaction_payment_mode: newTxn.transaction_payment_mode,
    added_by: newTxn.added_by,
    balance: Number(newTxn.transaction_amount),
  };

  //check if a previous transaction exists with the corresponding FROM_USER_ID
  connection.query(
    `select balance from transactions where from_user_id = ? order by created_at desc limit 1;`,
    newTxn.from_user_id,
    (err, rows) => {
      if (err) {
        return result(err);
      }
      if (rows.length !== 0) {
        console.log("step 1");
        newTxn.balance = rows[0].balance + newTxn.balance; //deducting balance from from_user_id
        return utils.insertTxns(newTxn, newTxn2, result);
      }
    }
  );

  //check if a previous transaction exists with the corresponding TO_USER_ID
  connection.query(
    `select balance from transactions where from_user_id = ? order by created_at desc limit 1;`,
    newTxn.to_user_id,
    (err, rows) => {
      if (err) {
        return result({ error: messages[err["code"]] });
      }
      if (rows.length !== 0) {
        console.log("step 2");
        newTxn2.balance = rows[0].balance + newTxn2.balance; // adding balance to to_user_id
        return utils.insertTxns(newTxn, newTxn2, result);
      }
    }
  );
  console.log("step 3");
  return utils.insertTxns(newTxn, newTxn2, result);
};

Transaction.getBalanceById = (id, result) => {
  const queryStr = `select * from (select users.user_name as from_user_name,
  t.from_user_id as user_id,
  t.balance,
  users.user_role,
  t.created_at
  from transactions as t 
  join users on t.from_user_id = users.user_id
  order by t.created_at desc) as temp
  where user_id = ? limit 1;`;
  connection.query(queryStr, id, (err, rows) => {
    if (err) return result(err, null);
    if (!rows.length) return result({ error: messages["NOT_FOUND"] + id });

    return result({
      user_id: rows[0].user_id,
      user_name: rows[0].from_user_name,
      balance: rows[0].balance,
      user_role: rows[0].user_role,
      date: moment(rows[0].created_at).format("DD/MM/YYYY"),
    });
  });
};

Transaction.getTotalBalance = (result) => {
  const queryStr = `select * from
  (SELECT user_role,
  user_id,
  user_name,
  t.created_at,
  balance FROM transactions as t
  inner join 
  users as u where u.user_id = t.from_user_id
  GROUP BY from_user_id) as temp
  where user_role = 2;`;

  connection.query(queryStr, (err, rows) => {
    if (err) return result(err, null);
    if (!rows.length) return result({ error: messages["NOT_FOUND"] });
    let totalBalance = 0;
    rows.forEach((element) => {
      totalBalance += element.balance;
    });

    return result(totalBalance);
  });
};

module.exports = { Transaction };
