require("dotenv").config();

// configure your database connection
const dbConfig = {
  host: "localhost",
  user: process.env.DB_USER, //your username
  password: process.env.DB_PASSWORD, //your password
  // database: "apidb",
  database: "iaccounting",
  port: 3308, //your port
  multipleStatements: true,
};

module.exports = { dbConfig };
