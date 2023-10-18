const passport = require("passport");
// const config = require("../config");
const LocalStrategy = require("passport-local").Strategy;
// const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User.js");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ email: username }, async (err, user) => {
        if (err) {
          return done(err);
        }
        // Return if user not found in database
        if (!user) {
          return done(null, false);
        }

        const valid = await user.validPassword(password);
        // Return if password is wrong
        if (!valid) {
          return done(null, false);
        }
        // If credentials are correct, return the user object
        return done(null, user);
      });
    }
  )
);
