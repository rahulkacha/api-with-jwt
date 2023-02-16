const messages = {
  DB_CON_SUCCESSFUL: "Successfully connected to the database.",
  ER_DUP_ENTRY: "username or email already exists.",
  INVALID: "is invalid.",
  MISSING_VAL: "value(s) are missing; check the request body.",
  NOT_REGISTERED: " is not registered.",
  REG_SUCCESSFUL: "you have been successfully registered.",
  UNAUTHORIZED:
    "you are unauthorized to perform this operation. check your credentials.",
  EXPIRED: "token is expired.",
  NOT_FOUND: "record not found with id = ",
  SUCCESSFUL: "operation successful.",
  ER_BAD_NULL_ERROR: "invalid email.", // email specific error
  ER_DATA_TOO_LONG: "number is too long.",
  // JWT verfication errors
  TokenExpiredError: "your token is expired.",
  JsonWebTokenError: "your JWT signature is invalid.",
  SyntaxError: "Syntax error found in your token; i.e. the JWT is tampered.",
};

module.exports = { messages };
