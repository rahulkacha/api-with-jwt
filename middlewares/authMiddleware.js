require("dotenv").config();
const jwt = require("jsonwebtoken");
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
      if (err) {
        res.status(403).json({ error: "token is expired." });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ error: "unauthorized." });
  }
}

module.exports = { authenticateToken };
