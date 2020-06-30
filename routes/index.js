const express = require("express");
const bodyParser = require("body-parser");
const Course = require("../models/course");
const router = express.Router();
const Cart = require("../models/cart");

router.use(bodyParser.urlencoded({ extended: true }));

/* GET home page. */
router.get("/", (req, res, next) => {
  // Success message from the Checkout
  const successMessage = req.flash("success")[0];
  Course.find((err, docs) => {
    res.render("courses/index", {
      title: "Home | IFIS",
      courses: docs,
      successMessage: successMessage,
      noMessages: !successMessage,
    });
  });
});

router.get("/add-to-cart/:id", (req, res, next) => {
  const courseId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : { totalQty: 0 });

  Course.findById(courseId, (err, course) => {
    if (err) {
      return res.redirect("/");
    } else {
      cart.add(course, course.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect("/");
    }
  });
});

router.get("/shopping-cart", (req, res, next) => {
  if (!req.session.cart) {
    return res.render("courses/shopping-cart", {
      title: "Cart | IFIS",
      courses: null,
    });
  }
  const cart = new Cart(req.session.cart);
  res.render("courses/shopping-cart", {
    title: "Cart | IFIS",
    courses: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

router.get("/checkout", (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect("shop/shopping-cart");
  }
  const cart = new Cart(req.session.cart);
  const errorMessage = req.flash("error")[0];
  res.render("shop/checkout", {
    title: "Checkout | IFIS",
    total: cart.totalPrice,
    errorMessage: errorMessage,
    noErrors: !errorMessage,
  });
});

router.post("/checkout", (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }

  const cart = new Cart(req.session.cart);
  const stripe = require("stripe")(
    "sk_test_tfHwA44tZznXHm0TEgEnYACd008By5n7TG"
  );
  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
  stripe.charges.create(
    {
      amount: cart.totalPrice * 100,
      currency: "usd",
      source: req.body.stripeToken,
      description: "Test Charge",
    },
    function (err, charge) {
      // asynchronously called
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/checkout");
      }
      req.flash("success", "Successfully bought course");
      req.cart = null;
      res.redirect("/");
    }
  );
});

module.exports = router;
