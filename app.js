const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const Campground = require("./models/campground");

// MONGOOSE REQUIREMENTS
mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!");
  })
  .catch((err) => {
    console.log("OH NO! MONGO ERROR!!");
    console.log(err);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// EXPRESS REQUIREMENTS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "My Backyard",
    description: "Cheap camping",
  });
  await camp.save();
  res.send("CAMP");
});

app.listen("3000", () => {
  console.log("LISTENING ON PORT 3000");
});
