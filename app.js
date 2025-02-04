const express = require("express");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const index = require("./routes/index");
const login = require("./routes/login");
const passportConfig = require("./passport");
var bodyParser = require('body-parser');

const app = express();

var users = [
  {id: 1, username: 'bob', password: 'secret', email: 'bob@example.com'}
  , {id: 2, username: 'scott', password: 'password', email: 'scott@example.com'}
];

passportConfig();

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res, next) => {
  res.render("index");
}, index);

app.get("/login", (req, res, next) => {
  res.render("login");
}, login);

app.post('/login', function (req, res, next) {
  passport.authenticate('local', { failureRedirect: '/login' }, function (err, user, info) {
      console.log(err, user, info);
      if (user) {
          res.send({user: user});
          res.redirect('/');
      } else {
          res.send({error: err, info: info});
      }
  })(req, res, next);
});

function findByUsername(username, callback) {
  for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      if (user.username === username) {
          // callback takes arguments (error,user)
          return callback(null, user);
      }
  }
  return callback(null, null);
}

passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
  },
  function (username, password, done) {
      findByUsername(username, function (err, user) {
          if (err) {
              return done(err);
          }
          if (!user) {
              console.log('bad username');
              return done(null, false, {message: 'Incorrect username.'});
          } else {
              if (user.password === password) {
                  console.log('good username and password');
                  return done(null, user);
              } else {
                  console.log('good username and bad password');
                  return done(null, false, {message: 'Incorrect password.'});
              }
          }

      });
  }
));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: false}));

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
