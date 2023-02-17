require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user.routes");
const transactionRouter = require("./routes/transaction.routes");
const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.use("/txn", transactionRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}.`);
});
