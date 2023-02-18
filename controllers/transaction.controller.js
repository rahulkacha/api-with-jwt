const { Transaction } = require("../models/transaction.model");

const { messages } = require("../helpers/messages");

// function generate(req, res) {
//   if (
//     req.body.from_user_id &&
//     req.body.to_user_id &&
//     req.body.transaction_amount &&
//     req.body.transaction_other_details &&
//     req.body.transaction_status &&
//     req.body.transaction_category &&
//     req.body.transaction_payment_mode &&
//     req.body.added_by
//   ) {
//     const newTxn = new Transaction({
//       from_user_id: req.body.from_user_id.trim(),
//       to_user_id: req.body.to_user_id.trim(),
//       transaction_amount: req.body.transaction_amount,
//       transaction_other_details: req.body.transaction_other_details
//         .trim()
//         .toLowerCase(),
//       transaction_status: req.body.transaction_status,
//       transaction_category: req.body.transaction_category,
//       transaction_payment_mode: req.body.transaction_payment_mode,
//       added_by: req.body.added_by,
//     });

//     Transaction.generate(newTxn, (err, result) => {
//       if (err) return res.json(err);

//       return res.json(result);
//     });
//   } else {
//     return res.json({ error: messages["MISSING_VAL"] });
//   }
// }

function findAll(req, res) {
  Transaction.selectAll((result) => {
    res.json(result);
  });
}

function findOne(req, res) {
  Transaction.findById(req.params.id, (result) => {
    res.json(result);
  });
}

// TEST CONTROLLERS
function generateTxn(req, res) {
  if (
    req.body.from_user_id &&
    req.body.to_user_id &&
    req.body.transaction_amount &&
    req.body.transaction_other_details &&
    req.body.transaction_status &&
    req.body.transaction_category &&
    req.body.transaction_payment_mode
  ) {
    const newTxn = new Transaction({
      from_user_id: req.body.from_user_id.trim(),
      to_user_id: req.body.to_user_id.trim(),
      transaction_amount: Number(req.body.transaction_amount),
      transaction_other_details: req.body.transaction_other_details
        .trim()
        .toLowerCase(),
      transaction_status: req.body.transaction_status,
      transaction_category: req.body.transaction_category,
      transaction_payment_mode: req.body.transaction_payment_mode,
      added_by: req.user.user_id,
      balance: Number(req.body.transaction_amount),
    });

    Transaction.generate(newTxn, (err, result) => {
      if (err) return res.json(err);

      return res.json(result);
    });
  } else {
    return res.json({ error: messages["MISSING_VAL"] });
  }
}

module.exports = {
  generateTxn,
  findAll,
  findOne,
};
