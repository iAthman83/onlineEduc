const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  imagePath: { type: String, required: true, },
  title: { type: String, require: true, },
  description: { type: String, required: true, },
  price: { type: Number, required:true, }
});

module.exports = mongoose.model('Product', productSchema);
