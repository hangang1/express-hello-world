const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User.js');

module.exports = () => {
  passport.use(
      new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
              const exUser = await User.findOne({ username: username });
              if (exUser) {
                console.log(password);
                console.log(exUser.password);
                  const result = (password === exUser.password)? true : false;
                  console.log(result);
                  if (result) {
                    done(null, exUser);
                  } else {
                    done(null, false, { message: '비밀번호가일치하지않습니다.' });
                  }
              }
              else {
                  done(null, false, { message: '가입되지않은회원입니다.' });
              }
            } catch (error) {
              console.error(error);
              done(error);
            }
        },
      ),
  );
};
