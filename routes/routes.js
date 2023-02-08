const express = require("express");
const controllers = require("../controllers/controllers");
const middlewares = require("../middlewares/authMiddleware");
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
  .route("/login")

  .post(controllers.loginUser);

module.exports = router;
