const express = require("express");
const controllers = require("../controllers/controllers");
const middlewares = require("../middlewares/authMiddleware");
const router = express.Router();

const jwt = require("jsonwebtoken");

const users = [
  {
    username: "rahul",
    data: "fdfdfdfd",
  },
  {
    username: "cvcvgfg",
  },
];

router
  .route("/")

  .get(middlewares.authenticateToken, (req, res) => {
    res.json(users.filter((x) => x.username === req.user.username));
  });

router
  .route("/login")

  .post((req, res) => {
    const user = {
      username: req.body.username,
    };
    const accessToken = jwt.sign(user, process.env.PRIVATE_KEY);
    res.json({ accessToken: accessToken });
  });
module.exports = router;
