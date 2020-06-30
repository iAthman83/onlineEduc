const express = require("express");
const Course = require("../models/course");
const router = express.Router();
// Cross-site request protection
const csrf = require("csurf");
// Requrie passport for authentication
const passport = require("passport");

var csrfProtection = csrf();
router.use(csrfProtection);

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("user/profile", { title: "User Profile | IFIS" });
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  // This is also a method from passport
  req.logout();
  res.redirect("/");
});

// Add a single check to all routes that user is not supposed to be logged in
router.use("/", notLoggedIn, (req, res, next) => {
  next();
});
// Add user signup route with csrf protection
router.get("/signup", (req, res, next) => {
  const messages = req.flash("error");
  res.render("user/signup", {
    title: "Sign Up | IFIS",
    csrfToken: req.csrfToken(),
    messages: messages,
    hasError: messages.length > 0,
  });
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signup",
    failureFlash: true,
  })
);

router.get("/signin", (req, res, next) => {
  const messages = req.flash("error");
  res.render("user/signin", {
    title: "Sign In | IFIS",
    csrfToken: req.csrfToken(),
    messages: messages,
    hasError: messages.length > 0,
  });
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signin",
    failureFlash: true,
  })
);

module.exports = router;

// Implement route protection
function isLoggedIn(req, res, next) {
  // isAuthenticated is a method from passport
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function notLoggedIn(req, res, next) {
  // isAuthenticated is a method from passport
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
