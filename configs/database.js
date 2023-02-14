require("dotenv").config({ path: "../.env" });
const sql = require("mysql2");
const { dbConfig } = require("./dbConfig");
const { messages } = require("../helpers/messages");

const connection = sql.createConnection(dbConfig);

// open the MySQL connection
connection.connect((error) => {
  if (error) throw error;
  console.log(messages["DB_CON_SUCCESSFUL"]);
});

module.exports = connection;
