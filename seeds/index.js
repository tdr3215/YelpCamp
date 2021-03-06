const mongoose = require("mongoose");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const cities = require("./cities");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: ` ${cities[random1000].city}, ${cities[random1000].state} `,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia consectetur deserunt minima magni, quod molestiae rerum eligendi illum alias quos repudiandae cupiditate sapiente labore. Veritatis deleniti impedit modi saepe ea.",
      price,
    });

    await camp.save();
  }
};

seedDB().then(() => db.close());
