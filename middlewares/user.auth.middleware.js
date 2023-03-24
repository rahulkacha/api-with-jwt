require("dotenv").config();
const jwt = require("jsonwebtoken");
const { messages } = require("../helpers/messages");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
      if (err) {
        console.log(err);
        return res
          .status(401)
          .json({ error: messages[String(err).split(":")[0]] });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ error: messages["UNAUTHORIZED"] });
  }
}

function isSubAdmin(req, res, next) {
  if (req.user.user_role === 2) {
    // predefined condition in database (role = 2 ==> su Admin)
    next();
  } else {
    return res.status(401).json({ error: messages["UNAUTHORIZED"] });
  }
}

function isSuperAdmin(req, res, next) {
  // predefined condition in database (role = 1 ==> su Admin)
  if (req.user.user_role === 1) {
    next();
  } else {
    return res.status(401).json({ error: messages["UNAUTHORIZED"] });
  }
}

function isUser(req, res, next) {
  // predefined condition in database (role = 1 ==> su Admin)
  if (req.user.user_role === 3) {
    next();
  } else {
    return res.status(401).json({ error: messages["UNAUTHORIZED"] });
  }
}

module.exports = { authenticateToken, isSubAdmin, isSuperAdmin, isUser };
