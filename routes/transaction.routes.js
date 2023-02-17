const express = require("express");
const authControllers = require("../controllers/user.auth.controller");
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

transactionRouter.route("/find/:id").get(controllers.findOne); //su admin



module.exports = transactionRouter;
