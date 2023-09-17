const mod = require("../modules").module;
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
  mod.passport.authenticate("local", function (err, user, info) {
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

const authPage = (req, res) => {
  const state = mod.crypto.randomBytes(16).toString("hex");
  res.cookie("XSRF-TOKEN", state);
  res.send({
    authUrl:
      "https://github.com/login/oauth/authorize?client_id=" +
      mod.config.CLIENT_ID +
      "&redirect_uri=" +
      mod.config.REDIRECT_URI +
      "&scope=read:user&allow_signup=" +
      true +
      "&state=" +
      state,
  });
};

const getAccessToken = (req, res) => {
  let state = req.headers["x-xsrf-token"];
  mod
    .axios({
      url:
        "https://github.com/login/oauth/access_token?client_id=" +
        mod.config.CLIENT_ID +
        "&client_secret=" +
        mod.config.CLIENT_SECRET +
        "&code=" +
        req.body.code +
        "&redirect_uri=" +
        mod.config.REDIRECT_URI +
        "&state=" +
        state,
      method: "POST",
      headers: { Accept: "application/json" },
    })
    .then(function (resp) {
      if (resp.data.access_token) {
        req.session.token = resp.data.access_token;
      }
      res.send(resp.data);
    })
    .catch(function (err) {
      res.send(err);
    });
};

const getUserDetails = (req, res) => {
  if (req.session.token) {
    mod
      .axios({
        url: "https://api.github.com/user",
        method: "GET",
        headers: { Authorization: "token" + " " + req.session.token },
      })
      .then(function (resp) {
        res.cookie("login", resp.data.login, { httpOnly: true });
        res.send(resp.data);
      })
      .catch(function (err) {
        res.send(err);
      });
  } else {
    res.status(401).send();
  }
};

const logout = (req, res) => {
  req.session = null;
  res.clearCookie("sess");
  res.clearCookie("login");
  res.status(200).send();
};

module.exports = {
  register,
  login,
  authPage,
  getAccessToken,
  getUserDetails,
  logout,
};
