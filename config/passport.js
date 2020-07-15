const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const keys = require("./keys");
const User = require("../models/index");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options for the strategy
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    //callback function
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((user) => {
        if (user) {
          //do something
          done(null, user);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture,
          })
            .save()
            .then((user) => console.log(user));

          done(null, user);
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      callbackURL: "/auth/facebook/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }).then((user) => {
        if (user) {
          done(null, user);
        } else {
          new User({
            facebookId: profile.id,
            facebookName: profile.displayName,
          })
            .save()
            .then((user) => console.log(user));
          done(null, user);
        }
      });
    }
  )
);
