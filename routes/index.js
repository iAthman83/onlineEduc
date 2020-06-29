const express = require('express');
const bodyParser = require('body-parser');
const Product = require('../models/product');
const router = express.Router();
const Cart = require('../models/cart');

router.use(bodyParser.urlencoded({ extended: true }));

/* GET home page. */
router.get('/', (req, res, next) => {
  // Success message from the Checkout
  const successMessage = req.flash('success')[0];
  Product.find((err, docs) => {
    // Set the products to display in row and 3 in every row
    // const productChunks = [];
    // const chunkSize = 3;
    // for (var i = 0; i < docs.length; i + chunkSize) {
    //   productChunks.push(docs.slice(i, i + chunkSize));
    // }
    res.render('shop/index', { title: 'Home | Mitumba',
                                products: docs,
                                successMessage: successMessage,
                                noMessages: !successMessage});
  });
});

router.get('/add-to-cart/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : { totalQty: 0});

  Product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect('/');
    } else {
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/');
    }
  });
});

router.get('/shopping-cart', (req, res, next) => {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { title: 'Shopping Cart | Mitumba', products: null });
  }
  const cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { title: 'Shopping Cart | Mitumba',
                                      products: cart.generateArray(),
                                      totalPrice: cart.totalPrice });
});

router.get('/checkout', (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('shop/shopping-cart');
  }
  const cart = new Cart(req.session.cart);
  const errorMessage = req.flash('error')[0];
  res.render('shop/checkout', { title: 'Checkout | Mitumba',
                                total: cart.totalPrice,
                                errorMessage: errorMessage,
                                noErrors: !errorMessage, });
});

router.post('/checkout', (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }

  const cart = new Cart(req.session.cart);
  const stripe = require('stripe')('sk_test_tfHwA44tZznXHm0TEgEnYACd008By5n7TG');
  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
  stripe.charges.create(
    {
      amount: cart.totalPrice * 100,
      currency: 'usd',
      source: req.body.stripeToken,
      description: 'Test Charge',
    },
    function(err, charge) {
      // asynchronously called
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }
      req.flash('success', 'Successfully bought product');
      req.cart = null;
      res.redirect('/');
    }
  );
});

module.exports = router;
