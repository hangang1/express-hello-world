const express = require("express");
const router = express.Router();

router.get("/login", (req, res, next) => {
  res.render("login", { title: "로그인" });
});

module.exports = router;
