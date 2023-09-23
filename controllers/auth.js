const axios = require("axios");
const config = require("../config");
const crypto = require("crypto");
const passport = require("passport");
const User = require("../models/User.js");
const Education = require("../models/education/Education.js");
const Employment = require("../models/employment/Employment.js");
const Projects = require("../models/projects/Projects.js");

const register = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    username: req.body.username,
    name: req.body.name,
    coverImage: "",
    profileImage: "",
    role: "",
    bio: "",
    nationality: "",
    location: "",
    languagesSpoken: [],
    cv: "",
    skills: [],
    github: "",
    twitter: "",
    linkedIn: "",
    theme: "light",
    notifications: true,
  });

  await user.setPassword(req.body.password);

  const employment = new Employment({ user: user._id });
  const projects = new Projects({ user: user._id });
  const education = new Education({ user: user._id });

  user.employment = employment._id;
  user.projects = projects._id;
  user.education = education._id;

  try {
    await education.save();
    await employment.save();
    await projects.save();
    await user.save();

    const token = user.generateJwt();
    // const token = jwt.sign({ id: user._id }, process.env.SECRET, {
    //   expiresIn: 7200000,
    // });
    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      const token = user.generateJwt();
      res.status(200).json({ token, user });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res, next);
};

const isUniqueUsername = (req, res) => {
  User.find({}, { username: 1, _id: 0 }, (err, users) => {
    const matchingUsername = users.find(
      (user) => user.username === req.params.username
    );
    if (matchingUsername) res.status(200).json({ notUnique: true });
    else res.status(200).json(null);
  });
};

const authPage = (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("XSRF-TOKEN", state);
  res.send({
    authUrl:
      "https://github.com/login/oauth/authorize?client_id=" +
      config.GITHUB_CLIENT_ID +
      "&scope=read:user&allow_signup=" +
      true +
      "&state=" +
      state,
  });
};

const getAccessToken = (req, res) => {
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
      res.send(resp.data);
    })
    .catch((err) => {
      res.send(err);
    });
};

const getUserDetails = (req, res) => {
  if (req.session.token) {
    axios({
      url: "https://api.github.com/user",
      method: "GET",
      headers: { Authorization: "token" + " " + req.session.token },
    })
      .then((githubResponse) => {
        User.findOne(
          { githubId: githubResponse.data.id },
          async (err, user) => {
            console.log(user);
            if (err) {
              console.log("HERE");
              res.send(err);
            }

            if (!user) {
              console.log("!USER");
              User.init();
              user = new User({
                githubId: githubResponse.data.id,
                email: githubResponse.data.email,
                username: githubResponse.data.login,
                name: githubResponse.data.name,
                coverImage: "",
                profileImage: "",
                role: "",
                bio: "",
                nationality: "",
                location: "",
                languagesSpoken: [],
                cv: "",
                skills: [],
                github: githubResponse.data.login,
                twitter: "",
                linkedIn: "",
                theme: "light",
                notifications: false,
              });

              const employment = new Employment({ user: user._id });
              const projects = new Projects({ user: user._id });
              const education = new Education({ user: user._id });

              user.employment = employment._id;
              user.projects = projects._id;
              user.education = education._id;

              try {
                console.log(user);
                console.log("NEW USER");
                await education.save();
                await employment.save();
                await projects.save();
                await user.save();
              } catch (err) {
                console.log(err);
                return res.send(err);
              }
            }
            console.log("GENERATE TOKEN");

            const token = user.generateJwt();
            return res.status(200).json({ token, user });
          }
        );
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    res.status(401).send();
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
  login,
  isUniqueUsername,
  authPage,
  getAccessToken,
  getUserDetails,
  logout,
};
