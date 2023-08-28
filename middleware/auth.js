var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User.js");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // set the username field to be 'email'
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ email: username }, async (err, user) => {
        if (err) {
          return done(err);
        }
        // Return if user not found in database
        if (!user) {
          return done(null, false, {
            message: "User not found",
          });
        }

        const valid = await user.validPassword(password);
        // Return if password is wrong
        if (!valid) {
          return done(null, false, {
            message: "Password is wrong",
          });
        }
        // If credentials are correct, return the user object
        return done(null, user);
      });
    }
  )
);
