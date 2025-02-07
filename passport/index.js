const passport = require("passport");
const local = require("./localStrategy");
const User = require("../models/User");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.username);
  });

  passport.deserializeUser((username, done) => {
    User.findOne({ username: username })
      .then(user => {
        done(null, user);
      })
      .catch(err => done(err))
    });

  local();
};
