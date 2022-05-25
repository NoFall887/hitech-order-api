const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();

app.use(express.json());
mongoose.connect(process.env.DB_URL).catch((err) => console.log(err));

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("server running on port " + listener.address().port);
});
