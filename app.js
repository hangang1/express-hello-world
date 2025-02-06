const express = require("express");
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const index = require("./routes/index");
const login = require("./routes/login");
const passportConfig = require("./passport");
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const User = require('./models/User');
const Problem = require('./models/Problem');

passportConfig();

mongoose.connect("mongodb+srv://ldh9904:europe99!!@cluster0.lldi0.mongodb.net/1")
  .then(() => {
    console.log("Connected to MongoDB => UserAPI");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "./views");

const result = []

const pro2 = async function pro(){
  const problem = await Problem.find();
  for (i = 0; i < problem.length; i++) {
    result.push(problem[i]);
  }
  return result
}

pro2();

app.get("/", function (req, res, next) {
    res.render("index", {
      quiz: result
    });
  }, index);

app.get("/login", (req, res, next) => {
  res.render("login");
}, login);

app.use(cookieParser("secret"));
app.use(session({
  secure: true,
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    Secure: true
  },
  name: 'session-cookie'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/login', function (req, res, next) {
  passport.authenticate('local', { failureRedirect: '/login' }, (authError, user, info)=>{
    console.log(authError, user, info);
    if(authError){
      console.error(authError);
      return res.redirect('/login');
    }
    if (!user){
      return res.redirect("/login");
    }
    return req.login(user, (loginError) => {
      if(loginError) {
        console.error(loginError);
        res.send("<p>로그인 에러</p>");
        return res.redirect("/login");
      }
      return res.redirect('/');
    });
  })(req,res,next);
});

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
