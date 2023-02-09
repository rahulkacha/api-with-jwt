require("dotenv").config({path:"../.env"});
const sql = require("mysql2");
const {dbConfig} = require("../configs/dbConfig");

const connection = sql.createConnection(dbConfig);

connection.connect();

// this query will create a new table
const query = `CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(100),
	email VARCHAR(100) NOT NULL UNIQUE,
	userName VARCHAR(100) UNIQUE,
	password VARCHAR(255) NOT NULL,
	registeredAt DATETIME NOT NULL DEFAULT NOW(),
	role VARCHAR(100) NOT NULL DEFAULT 'normal',
	PRIMARY KEY (id)
);`;

connection.query(query, (err, rows, fields) => {
  if (err) {
    throw err;
  } else {
    console.log(rows);
  }
});

connection.end();
