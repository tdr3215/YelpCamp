const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

// ROUTERS
const reviews = require("./routes/reviews");
const campgrounds = require("./routes/campgrounds");

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

// ACCESS VIEWS DIR GLOBALLY
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// MIDDLEWARE
app.use(express.urlencoded({ extended: true })); //PARSING req.body
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Configuring Session for Cookies
const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    //date.now is in milliseconds :( this is a week from today
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  //having access to the success/error flash message globally
  next();
});

// Route Handlers
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// LAYOUT
app.engine("ejs", ejsMate);

// ERROR HANDLING

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found", 404));
});

// GENERIC ERROR HANDLER
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Oh No,Something Went Wrong";
  res.status(statusCode).render("error", { err });
});

app.listen("3000", () => {
  console.log("LISTENING ON PORT 3000");
});
