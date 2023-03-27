const express = require("express");
const authControllers = require("../controllers/user.auth.controller");
const controllers = require("../controllers/user.controller");
const middlewares = require("../middlewares/user.auth.middleware");
const userRouter = express.Router();

userRouter
  .route("/")

  .get(middlewares.authenticateToken, (req, res) => {
    res.json({
      response: "you are authenticated. this is some secret information.",
    });
  });

userRouter.route("/login").get(authControllers.loginUser);

userRouter
  .route("/create")
  .post(
    // middlewares.authenticateToken,
    // middlewares.isSuperAdmin,
    controllers.createUser
  ); //su admin

userRouter
  .route("/getAll")
  .get(
    // middlewares.authenticateToken,
    // middlewares.isSuperAdmin,
    controllers.findAll
  ); //su admin

userRouter.route("/find/:id").get(controllers.findOne); //su admin

userRouter
  .route("/update/:id")
  .patch(
    // middlewares.authenticateToken,
    // middlewares.isSuperAdmin,
    controllers.updateOne
  ); //su admin

userRouter
  .route("/delete/:id")
  .delete(
    middlewares.authenticateToken,
    middlewares.isSuperAdmin,
    controllers.deleteOne
  );

// TEST ROUTE
userRouter.get(
  "/userOnly",
  middlewares.authenticateToken,
  middlewares.isUser,
  (req, res) => {
    res.json({ message: "for USER only" });
  }
);
module.exports = userRouter;
