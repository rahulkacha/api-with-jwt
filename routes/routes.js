const express = require("express");
const moment = require("moment");
//
const mongoose = require("mongoose");
dbUrl = "mongodb://127.0.0.1/apiDB";
const User = require("../models/user");
const router = express.Router();
mongoose.set("strictQuery", false);
mongoose.connect(dbUrl);

router
  .route("/")

  .get((req, res) => {
    res.status(200);
    res.send({ response: "GET request to root route" });
  });

module.exports = router;
