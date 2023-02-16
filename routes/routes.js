const express = require("express");
const authControllers = require("../controllers/user.auth.controller");
const controllers = require("../controllers/user.controller");
const middlewares = require("../middlewares/user.auth.middleware");
const router = express.Router();

router
  .route("/")

  .get(middlewares.authenticateToken, (req, res) => {
    res.json({
      response: "you are authenticated. this is some secret information.",
    });
  });

router.route("/register").post(authControllers.registerUser);

router.route("/login").post(authControllers.loginUser);

router
  .route("/create")
  .post(
    middlewares.authenticateToken,
    middlewares.isSuperAdmin,
    controllers.createUser
  ); //su admin

router
  .route("/getAll")
  .get(
    middlewares.authenticateToken,
    middlewares.isSuperAdmin,
    controllers.findAll
  ); //admin su admin

router.route("/find/:id").get(controllers.findOne); //su admin

router
  .route("/update/:id")
  .patch(
    middlewares.authenticateToken,
    middlewares.isSuperAdmin,
    controllers.updateOne
  ); //su admin

router
  .route("/delete/:id")
  .delete(
    middlewares.authenticateToken,
    middlewares.isSuperAdmin,
    controllers.deleteOne
  );

// TEST ROUTE
router.get(
  "/adminOnly",
  middlewares.authenticateToken,
  middlewares.isSubAdmin,
  (req, res) => {
    res.json({ message: "for sub admin only." });
  }
);
module.exports = router;
