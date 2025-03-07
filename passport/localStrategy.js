const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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
                  const result = (password === exUser.password)? true : false;
                  if (result) {
                    done(null, exUser);
                  } else {
                    done(null, false, { message: '비밀번호가 일치하지않습니다.' });
                  }
              }
              else {
                  done(null, false, { message: '가입되지 않은 회원입니다.' });
              }
            } catch (error) {
              console.error(error);
              done(error);
            }
        },
      ),
  );
};
