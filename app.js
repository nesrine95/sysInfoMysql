"use strict "
const express = require("express");
const sysInfo = require("./routes/sysInfo");


const app = express();
const port = process.env.port || 8085;
app.use(express.json());


app.use(express.urlencoded({ extended: true }));
app.use("/sysInfo", sysInfo);

app.listen(port, err => {
  if (err) {
    return console.log("error", err);
  }
  console.log(`Listening on port ${port}`)
})


