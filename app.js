const express = require("express");
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

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res, next) => {
  res.render("index");
}, index);

app.get("/login", (req, res, next) => {
  res.render("login");
}, login);

app.use(cookieParser("secret"));
app.use(session({
  secure: true,	// https 환경에서만 session 정보를 주고받도록처리
  secret: process.env.COOKIE_SECRET, // 암호화하는 데 쓰일 키
  resave: false, // 세션을 언제나 저장할지 설정함
  saveUninitialized: true, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
  cookie: {	//세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
    httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    Secure: true
  },
  name: 'session-cookie' // 세션 쿠키명 디폴트값은 connect.sid이지만 다른 이름을 줄수도 있다.
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/login', function (req, res, next) {
  passport.authenticate('local', { failureRedirect: '/login' }, (authError, user, info)=>{
    if(authError){
      console.error(authError);
      return next(authError);
    }
    if (!user){
      return res.redirect(`/?loginError=${info.message}`)
    }
    return req.login(user, (loginError) => {
      if(loginError) {
        console.error(loginError);
        return next(loginError);
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
