const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

// Tell passport how to store userr in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, (req, email, password, done) => {
  // Use validator before checking if the email is already in use
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password').notEmpty().isLength({ min: 5 });
  const errors = req.validationErrors();
  if (errors) {
    const messages = [];
    errors.forEach(function(error) {
      // msg is added by the validator function
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({ 'email': email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      done(null, false, { message: 'Email is already in use.' });
    }
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save((err, result) => {
      if (err) {
        return done(err);
      } else {
        return done(null, newUser);
      }
    });
  });
}));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, (req, email, password, done) => {
  // Use validator before checking if the email is already in use
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    const messages = [];
    errors.forEach(function(error) {
      // msg is added by the validator function
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({ 'email': email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      done(null, false, { message: 'No user found.' });
    }
    if (!user.validPassword(password)) {
      done(null, false, { message: 'Wrong password' });
    }
    return done(null, user);
  });
}));
