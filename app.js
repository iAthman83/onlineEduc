const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// Validation package
const validator = require("express-validator");
// Require the session package
var session = require("express-session");
const mongoStore = require("connect-mongo")(session);
// Auhtentication with passport
const passport = require("passport");
const flash = require("connect-flash");

const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

const app = express();

// Connect to the mongodb server

mongoose.connect(
  "mongodb+srv://iathman83:B11sm1llah@cluster0.9h4be.azure.mongodb.net/onlineEduc?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// mongoose.connect("mongodb://localhost:27017/education", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Require the passport js file without binding it so the app.js know what it is
require("./config/passport");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// validator has to be called after the body-parser
app.use(validator());
app.use(cookieParser());
// set the app to use the sission middleware
app.use(
  session({
    secret: "secret-session",
    resave: false,
    saveUninitialized: false,
    // Store the session using the same mongoose connection
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

// Executed in all requests
app.use((req, res, next) => {
  // set the global variable
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use("/user", userRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
