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
  passport.authenticate("local", function (err, user, info) {
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      const token = user.generateJwt();
      res.status(200).json({ token });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res, next);
};

module.exports = { register, login };
