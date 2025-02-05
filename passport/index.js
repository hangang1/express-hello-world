const passport = require("passport");
const local = require("./localStrategy");
const User = require("../models/User");
const Problem = require("../models/Problem");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.username);
  });

  passport.deserializeUser((username, done) => {
    User.findeOne({ username: username })
      .then(user => {
        console.log("find id!");
        done(null, user);
      })
      .catch(err => done(err))
    })

  local();
};

