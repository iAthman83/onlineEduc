const Course = require("../models/course");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://iathman83:B11sm1llah@cluster0.9h4be.azure.mongodb.net/onlineEduc?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const courses = [
  new Course({
    imagePath: "/images/bi.jpg",
    title: "Business Intelligence",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 200,
  }),
  new Course({
    imagePath: "/images/data_science.jpg",
    title: "Data Science",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 2000,
  }),
  new Course({
    imagePath: "/images/cyber_security.jpg",
    title: "Cyber Security",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 3500,
  }),
  new Course({
    imagePath: "/images/course_1.jpg",
    title: "ReactJS",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 500,
  }),
];

var done = 0;
courses.forEach(function (course) {
  course.save(function (err, result) {
    done++;
    if (done === course.length) {
      exit();
    }
  });
});

function exit() {
  mongoose.disconnect();
}
