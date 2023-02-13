const express = require("express");
const controllers = require("../controllers/user.auth.controller");
const middlewares = require("../middlewares/user.auth.middleware");
const router = express.Router();

router
  .route("/")

  .get(middlewares.authenticateToken, (req, res) => {
    res.json({
      response: "you are authenticated. this is some secret information.",
    });
  });

router
  .route("/register")

  .post(controllers.registerUser);

  router
  .route("/testRegister")

  .post(controllers.testRegisterUser);

router
  .route("/login")

  .post(controllers.loginUser);

module.exports = router;
