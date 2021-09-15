const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const Campground = require("./models/campground");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema } = require("./schemas");

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
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// LAYOUT
app.engine("ejs", ejsMate);

// ROUTING
app.get("/", (req, res) => {
  res.render("home");
});

// INDEX
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// NEW DOC
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.Campground)
    //   throw new ExpressError("Invalid Campground Data", 400);

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// SHOW DOC
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campgrounds });
  })
);

// EDIT DOC
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campgrounds });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { new: true }
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// DELETE DOC
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndDelete(id, { ...req.body.campground });
    res.redirect("/campgrounds");
  })
);

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
