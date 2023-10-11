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

const initialUser = {
  bio: "",
  coverImage: "",
  email: "",
  emailToken: "",
  isVerified: false,
  github: {
    id: "",
    username: "",
  },
  interests: {
    professional_interests: [],
    personal_interests: [],
  },
  languagesSpoken: [],
  links: {
    cv: "",
    portfolio: "",
    x: "",
    linkedIn: "",
  },
  location: "",
  firstName: "",
  lastName: "",
  nationality: "",
  notifications: true,
  preferredLanguage: "en",
  previousEducation: [],
  profileImage: "",
  path: "",
  stack: [],
  theme: "dark",
  username: "",
};

const register = async (req, res, next) => {
  const user = new User({
    ...initialUser,
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

  try {
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
      .then(function (data) {
        res.status(200).json({ messageSuccess: data.MessageId });
      })
      .catch(function (err) {
        res.status(400).json({ err });
      });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res) => {
  try {
    User.findOne({ emailToken: req.query.token }, async (err, user) => {
      if (err) throw err;

      user.emailToken = null;
      user.isVerified = true;
      await user.save();

      res.redirect("http://localhost:4200/login?verified=true");
    });
  } catch (error) {}
};

const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.status(404).json(err);
      return;
    }

    if (user) {
      const token = user.generateJwt();
      res.status(200).json({ token, user });
    } else {
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

const isUniqueEmail = (req, res) => {
  User.find({}, { email: 1, _id: 0 }, (err, users) => {
    const matchingEmail = users.find((user) => user.email === req.params.email);
    if (matchingEmail) res.status(200).json({ notUnique: true });
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

// const getUserDetails = (req, res) => {
//   console.log("HERE =====>>>>>", req.params.id);
//   if (req.session.token) {
//     axios({
//       url: "https://api.github.com/user",
//       method: "GET",
//       headers: { Authorization: "token" + " " + req.session.token },
//     })
//       .then((githubAccount) => {
//         console.log(githubAccount);

//         if (req.params.id) {
//           User.findOne(
//             {
//               _id: req.params.id
//             },
//             async (err, user) => {
//               if (user) {

//                 if (user.github?.id) {
//                   User.findOne({ "github.id": githubAccount.data.id,}, async (err, githubUser) => {
//                     if (githubUser) {
//                       if (githubUser._id !== user._id) {
//                         res.status(200).json({ message: "This GitHub Account has already been linked to another roadmapr account, please remove it from the other account to continue"})
//                       }
//                     }
//                   })
//                 } else {

//                 }

//                 if (!user.github?.id) {
//                   user.github = {
//                     id: githubAccount.id,
//                     username: githubAccount.login
//                   }
//                 }
//                 else if (user.github?.id !== githubAccount.id) {
//                   res
//                   .status(200)
//                   .json({
//                     message:
//                       "User already exists with that email address. Go to account settings to connect github",
//                   });
//                 }
//                 const token = user.generateJwt();
//                 return res.status(200).json({ token, user });
//               }
//             }
//           );
//         } else {
//           User.findOne(
//             {
//               "github.id": githubAccount.data.id,
//             },
//             async (err, user) => {
//               if (user) {
//                 console.log("NUMBER 1");
//                 const token = user.generateJwt();
//                 return res.status(200).json({ token, user });
//               }
//             }
//           );

//           User.findOne(
//             {
//               email: githubAccount.data.email,
//             },
//             async (err, user) => {
//               if (user && req.params.id && req.params.id === user._id) {
//                 console.log("NUMBER 2");
//                 const token = user.generateJwt();
//                 return res.status(200).json({ token, user });
//               } else {
//                 res
//                   .status(200)
//                   .json({
//                     message:
//                       "User already exists with that email address. Go to account settings to connect github",
//                   });
//               }
//             }
//           );
//         }

//               User.init();
//               user = new User({
//                 ...initialUser,
//                 github: {
//                   id: githubAccount.data.id,
//                   username: githubAccount.data.login,
//                 },
//                 email: githubAccount.data.email,
//                 username: githubAccount.data.login,
//                 name: githubAccount.data.name,
//               });

//               const employment = new Employment({ user: user._id });
//               const projects = new Projects({ user: user._id });
//               const education = new Education({ user: user._id });

//               user.employment = employment._id;
//               user.projects = projects._id;
//               user.education = education._id;

//               try {
//                 await education.save();
//                 await employment.save();
//                 await projects.save();
//                 await user.save();
//               } catch (err) {
//                 return res.send(err);
//               }
//             }

//             const token = user.generateJwt();
//             return res.status(200).json({ token, user });
//           }
//         );
//       })
//       .catch((err) => {
//         res.send(err);
//       });
//   } else {
//     res.status(401).send();
//   }
// };

const getUserDetails = (req, res) => {
  if (req.session.token) {
    axios({
      url: "https://api.github.com/user",
      method: "GET",
      headers: { Authorization: "token" + " " + req.session.token },
    })
      .then((githubResponse) => {
        User.findOne(
          { "github.id": githubResponse.data.id },
          async (err, user) => {
            if (err) throw err;

            if (!user) {
              User.init();
              user = new User({
                ...initialUser,
                github: {
                  id: githubResponse.data.id,
                  username: githubResponse.data.login,
                },
                email: githubResponse.data.email,
                username: githubResponse.data.login,
                // name: githubResponse.data.name, // CHECK WHAT RETURNED VALUE IS AND SPLIT IF NECESSARY
              });

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
              } catch (err) {
                return res.send(err);
              }
            }

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
  verifyEmail,
  login,
  isUniqueUsername,
  isUniqueEmail,
  authPage,
  getAccessToken,
  getUserDetails,
  logout,
};
