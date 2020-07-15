const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

//auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

//auth with facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

//logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//callback google route
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect("/profile");
  }
);

module.exports = router;
