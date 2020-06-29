const Product = require('../models/product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mitumba', {useNewUrlParser: true, useUnifiedTopology: true});

const products = [
  new Product({
    imagePath: '/images/tshirt3.jpeg',
    title: 'T shirt',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    price: 200,
  }),
  new Product({
    imagePath: '/images/1.jpg',
    title: 'Shoe',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    price: 2000,
  }),
  new Product({
    imagePath: '/images/2.jpg',
    title: 'Shoe',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    price: 3500,
  }),
  new Product({
    imagePath: '/images/dress.jpg',
    title: 'Dress',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    price: 500,
  }),
  new Product({
    imagePath: '/images/denimjacket.jpg',
    title: 'Denim Jacket',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    price: 800,
  }),
  new Product({
    imagePath: '/images/dress1.jpg',
    title: 'Dress',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    price: 350,
  }),
];

var done = 0;
products.forEach(function(product) {
  product.save(function(err, result) {
    done++;
    if (done === product.length) {
      exit();
    }
  });
});

function exit() {
  mongoose.disconnect();
}
