const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema, reviewSchema } = require("../schemas");

// FORM VALIDATION
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


// INDEX
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// NEW DOC
router.get("/new", (req, res) => {
  res.render("/new");
});
router.post(
  "/",
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
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campgrounds/show", { campgrounds });
  })
);

// EDIT DOC
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campgrounds });
  })
);

router.put(
  "/:id",
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
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndDelete(id, { ...req.body.campground });
    res.redirect("/campgrounds");
  })
);


module.exports = router;
