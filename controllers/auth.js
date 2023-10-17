const axios = require("axios");
const config = require("../config");
const crypto = require("crypto");
const passport = require("passport");
const User = require("../models/User.js");
const Education = require("../models/education/Education.js");
const Employment = require("../models/employment/Employment.js");
const Projects = require("../models/projects/Projects.js");
const { getVerificationEmail } = require("../utils/amazonSes");
const AWS = require("aws-sdk");
AWS.config.update({ region: config.AWS_BUCKET_REGION });
const Http400Error = require("../utils/errorHandling/http400Error");
const Http404Error = require("../utils/errorHandling/http404Error");
const Http500Error = require("../utils/errorHandling/http500Error");
const validPasswordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
const emailRegex = /^\S+@\S+\.\S+$/;

const register = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new Http400Error("No information was provided");
    }
    if (!req.body.username || !req.body.email || !req.body.password) {
      throw new Http400Error(
        "Required information missing, please check all required fields have been filled"
      );
    }
    if (req.body.username.length < 2) {
      throw new Http400Error("Username must be of minimum length 2 characters");
    }
    if (await User.exists({ username: req.body.username })) {
      throw new Http400Error(
        "Username already in use, please try something else"
      );
    }
    if (!emailRegex.test(req.body.email)) {
      throw new Http400Error("Email is not valid");
    }
    if (await User.exists({ email: req.body.email })) {
      throw new Http400Error(
        "Email already in use, please log in or try a different email"
      );
    }
    if (!validPasswordRegex.test(req.body.password)) {
      throw new Http400Error(
        "Password invalid: Passwords must be at least 6 characters long, contains at least 1 number and 1 special character (!@#$%^&*)"
      );
    }

    const user = new User({
      preferredLanguage: "en",
      theme: "dark",
      email: req.body.email,
      emailToken: crypto.randomBytes(64).toString("hex"),
      username: req.body.username,
    });

    await user.setPassword(req.body.password);

    const employment = new Employment({ user: user._id });
    const projects = new Projects({ user: user._id });
    const education = new Education({ user: user._id });

    user.employment = employment._id;
    user.projects = projects._id;
    user.education = education._id;

    await education.save();
    await employment.save();
    await projects.save();
    await user.save();

    // Create the promise and SES service object
    const verificationLink = `http://${req.headers.host}/auth/verify-email?token=${user.emailToken}`;
    const verificationEmail = getVerificationEmail(
      req.body.email,
      verificationLink
    );
    const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
      .sendEmail(verificationEmail)
      .promise();

    // Handle promise's fulfilled/rejected states
    sendPromise
      .then((data) => {
        res.status(200).json({ messageSuccess: data.MessageId });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailToken: req.query.token });

    if (!user) {
      throw new Http404Error("User not found");
    }

    user.emailToken = null;
    user.isVerified = true;
    await user.save();

    res.redirect("http://localhost:4200/login?verified=true");
  } catch (error) {
    next(error);
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    try {
      if (err) {
        throw new Http500Error(err.message);
      }

      if (!user) {
        throw new Http404Error("Invalid Username or Password");
      }

      const token = user.generateJwt();
      res.status(200).json({ token, user });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

const isUniqueUsername = async (req, res, next) => {
  try {
    if (!req.params.username) {
      throw new Http400Error("No information was provided");
    }

    const user = await User.exists({ username: req.params.username });

    if (user) res.status(200).json({ notUnique: true });
    else res.status(200).json(null);
  } catch (error) {
    next(error);
  }
};

const isUniqueEmail = async (req, res, next) => {
  try {
    if (!req.params.email) {
      throw new Http400Error("No information was provided");
    }

    const user = await User.exists({ email: req.params.email });

    if (user) res.status(200).json({ notUnique: true });
    else res.status(200).json(null);
  } catch (error) {
    next(error);
  }
};

const authPage = (req, res, next) => {
  try {
    const state = crypto.randomBytes(16).toString("hex");
    res.cookie("XSRF-TOKEN", state);
    res.status(200).send({
      authUrl:
        "https://github.com/login/oauth/authorize?client_id=" +
        config.GITHUB_CLIENT_ID +
        "&scope=read:user&allow_signup=" +
        true +
        "&state=" +
        state,
    });
  } catch (error) {
    next(error);
  }
};

const getAccessToken = (req, res, next) => {
  try {
    const state = req.headers["x-xsrf-token"];
    axios({
      url:
        "https://github.com/login/oauth/access_token?client_id=" +
        config.GITHUB_CLIENT_ID +
        "&client_secret=" +
        config.GITHUB_CLIENT_SECRET +
        "&code=" +
        req.body.code +
        "&state=" +
        state,
      method: "POST",
      headers: { Accept: "application/json" },
    })
      .then((resp) => {
        if (resp.data.access_token) {
          req.session.token = resp.data.access_token;
        }
        res.status(200).send(resp.data);
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
};

const getGithubUser = async (req, res, next) => {
  try {
    if (!req.session.token) {
      throw new Http500Error("Token not provided, please try again");
    }

    axios({
      url: "https://api.github.com/user",
      method: "GET",
      headers: { Authorization: "token" + " " + req.session.token },
    })
      .then(async (githubUser) => {
        try {
          const existingGithubOAuthUser = await User.findOne({
            "github.id": githubUser.data.id,
          });

          if (existingGithubOAuthUser) {
            const token = existingGithubOAuthUser.generateJwt();
            return res
              .status(200)
              .json({ token, user: existingGithubOAuthUser });
          }

          const existingUserMatchingEmail = await User.findOne({
            email: githubUser.data.email,
          });

          if (existingUserMatchingEmail) {
            existingUserMatchingEmail.github = {
              id: githubUser.data.id,
              username: githubUser.data.login,
            };

            await existingUserMatchingEmail.save();
            const token = existingUserMatchingEmail.generateJwt();
            return res
              .status(200)
              .json({ token, user: existingUserMatchingEmail });
          }

          const existingUserMatchingUsername = await User.findOne({
            username: githubUser.data.login,
          });

          User.init();
          user = new User({
            preferredLanguage: "en",
            theme: "dark",
            github: {
              id: githubUser.data.id,
              username: githubUser.data.login,
            },
            email: githubUser.data.email,
            username: existingUserMatchingUsername
              ? githubUser.data.login +
                (Math.floor(Math.random() * 90000) + 10000)
              : githubUser.data.login,
          });

          const employment = new Employment({ user: user._id });
          const projects = new Projects({ user: user._id });
          const education = new Education({ user: user._id });

          user.employment = employment._id;
          user.projects = projects._id;
          user.education = education._id;

          await education.save();
          await employment.save();
          await projects.save();
          await user.save();

          const token = user.generateJwt();
          return res.status(200).json({ token, user });
        } catch (error) {
          next(error);
        }
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

const updateGithubExistingUser = (req, res) => {
  try {
    if (!req.session.token) {
      throw new Http500Error("Token not provided, please try again");
    }
    if (!req.params.id) {
      throw new Http404Error("User not found");
    }

    axios({
      url: "https://api.github.com/user",
      method: "GET",
      headers: { Authorization: "token" + " " + req.session.token },
    })
      .then(async (githubUser) => {
        try {
          const existingUserWithThisGithub = await User.findOne({
            "github.id": githubUser.data.id,
          });

          if (existingUserWithThisGithub) {
            throw new Http400Error(
              "This GitHub Account has already been linked to another roadmapr account, please unlink the other account to continue"
            );
          }

          const user = await User.findOne({ _id: req.params.id });

          if (!user) {
            throw new Http404Error("User not found");
          }

          user.github = {
            id: githubUser.data.id,
            username: githubUser.data.login,
          };
          await user.save();

          return res.status(200).json({ user });
        } catch (error) {
          next(error);
        }
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  req.session = null;
  res.clearCookie("github-session");
  res.clearCookie("login");
  res.status(200).send();
};

module.exports = {
  register,
  verifyEmail,
  login,
  isUniqueUsername,
  isUniqueEmail,
  authPage,
  getAccessToken,
  getGithubUser,
  updateGithubExistingUser,
  logout,
};
