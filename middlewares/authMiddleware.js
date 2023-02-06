require("dotenv").config();
const jwt = require("jsonwebtoken");
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
      if (err) {
        res.sendStatus(403);
        console.log("err 1");
      } else {
        req.user = user;
        console.log(req.user);
        next();
      }
    });
  } else {
    res.sendStatus(401);
    console.log("err 2");
  }
}

module.exports = { authenticateToken };
