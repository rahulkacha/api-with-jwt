const express = require("express");
const controllers = require("../controllers/controllers");
const middlewares = require("../middlewares/authMiddleware");
const router = express.Router();

const jwt = require("jsonwebtoken");

const users = [
  {
    username: "rahulkacha",
  },
  {
    username: "rahul",
  },
  {
    username: "abcd",
  },
];

router
  .route("/")

  .get(middlewares.authenticateToken, (req, res) => {
    res.json(users.filter((x) => x.username === req.user.username));
  });

router
  .route("/login")

  .post(controllers.loginUser);
module.exports = router;

router
  .route("/register")

  .post(controllers.registerUser);
