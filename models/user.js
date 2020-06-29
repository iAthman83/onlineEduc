// Create user sign up Schema
const mongoose = require('mongoose');
// Encrypt password with bcrypt
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
});

// Encrypt password using bcrypt
userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
