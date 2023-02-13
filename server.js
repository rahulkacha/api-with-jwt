require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/routes");
const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);

app.listen(port, () => {
  console.log(`server is running on port ${port}.`);
});
