const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const bluebird = require("bluebird");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

// Get the API route ...
var api = require("./routes/api.route");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

//Use the API routes for all routes matching /api
app.use("/api", api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Cors configuration
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "MongoDB Atlas");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

module.exports = app;

//Set up default mongoose connection
mongoose.Promise = bluebird;
mongoose
  .connect(
    "mongodb+srv://adminRW:adminRW@todo-fnddg.mongodb.net/test",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log(`Succesfully Connected to the
Mongodb Database  at URL : mongodb://127.0.0.1:27017/todoapp`);
  })
  .catch(() => {
    console.log(`Error Connecting to the Mongodb 
Database at URL : mongodb://127.0.0.1:27017/todoapp`);
  });

const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
