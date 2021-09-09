const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

// MONGOOSE REQUIREMENTS
mongoose
  .connect("mongodb://localhost:27017/shopApp")
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!");
  })
  .catch((err) => {
    console.log("OH NO! MONGO ERROR!!");
    console.log(err);
  });

// EXPRESS REQUIREMENTS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));

app.listen("3000", () => {
  console.log("LISTENING ON 3000");
});
