require("dotenv").config();
const jwt = require("jsonwebtoken");
const { messages } = require("../helpers/messages");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
      if (err) {
        res.status(403).json({ error: messages["EXPIRED"] });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ error: messages["UNAUTHORIZED"] });
  }
}

module.exports = { authenticateToken };
