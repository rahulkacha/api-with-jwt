const express = require("express");
const controllers = require("../controllers/transaction.controller");
const middlewares = require("../middlewares/user.auth.middleware");
const transactionRouter = express.Router();

transactionRouter

  .route("/getAllTxns")
  .get(
    middlewares.authenticateToken,
    middlewares.isSuperAdmin,
    controllers.findAll
  );

transactionRouter
  .route("/genTxn")
  .post(
    middlewares.authenticateToken,
    middlewares.isSuperAdmin,
    controllers.generate
  );

transactionRouter
  .route("/find/:id")
  .get(
    middlewares.authenticateToken,
    middlewares.isSuperAdmin,
    controllers.findOne
  );

// TEST ROUTE
transactionRouter
  .route("/testTxn")
  .post(
    middlewares.authenticateToken,
    middlewares.isSuperAdmin,
    controllers.testGenearate
  );

module.exports = transactionRouter;
