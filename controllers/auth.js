const axios = require("axios");
const config = require("../config");
const crypto = require("crypto");
const passport = require("passport");
const User = require("../models/User.js");
const Roadmap = require("../models/Roadmap.js");
const Education = require("../models/education/Education.js");
const Experience = require("../models/experience/Experience.js");
const Projects = require("../models/projects/Projects.js");
const {
  API_VERSION,
  getVerificationEmail,
  getPasswordResetEmail,
} = require("../utils/email/email.js");
const Http400Error = require("../utils/errorHandling/http400Error");
const Http404Error = require("../utils/errorHandling/http404Error");
const Http500Error = require("../utils/errorHandling/http500Error");
const ALERTS = require("../utils/alerts");
const validPasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{6,20}$/;
const emailRegex = /^\S+@\S+\.\S+$/;
const { updateUserGithubData } = require("../utils/github");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const register = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
    } else if (await User.exists({ username: req.body.username })) {
      throw new Http400Error(ALERTS.AUTH.ERROR.USERNAME_USED);
    } else if (!emailRegex.test(req.body.email)) {
      throw new Http400Error(ALERTS.AUTH.ERROR.EMAIL_INVALID);
    } else if (await User.exists({ email: req.body.email })) {
      throw new Http400Error(ALERTS.AUTH.ERROR.EMAIL_USED);
    } else if (!validPasswordRegex.test(req.body.password)) {
      throw new Http400Error(ALERTS.AUTH.ERROR.PASSWORD_INVALID);
    }

    const user = new User({
      preferredLanguage: req.body.preferredLanguage,
      theme: "dark",
      email: req.body.email,
      emailVerification: {
        emailToken: crypto.randomBytes(64).toString("hex"),
        isVerified: false,
      },
      username: req.body.username,
    });

    await user.setPassword(req.body.password);

    const experience = new Experience({ user: user._id });
    const projects = new Projects({ user: user._id });
    const education = new Education({ user: user._id });

    const roadmap = new Roadmap({
      user: user._id,
      education: education._id,
      projects: projects._id,
      experience: experience._id,
    });

    user.experience = experience._id;
    user.projects = projects._id;
    user.education = education._id;
    user.roadmap = roadmap._id;

    await education.save();
    await experience.save();
    await projects.save();
    await roadmap.save();
    await user.save();

    const verificationLink = `http://${req.headers.host}/api/auth/verify-email?token=${user.emailVerification.emailToken}`;
    const verificationEmail = getVerificationEmail(
      req.body.email,
      verificationLink,
      req.body.preferredLanguage
    );

    sgMail
      .send(verificationEmail)
      .then(() => {
        res.status(200).json({ successMessage: "Verification Email Sent" });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

const resendRegisterEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    const verificationLink = `http://${req.headers.host}/api/auth/verify-email?token=${user.emailVerification.emailToken}`;
    const verificationEmail = getVerificationEmail(
      user.email,
      verificationLink,
      user.preferredLanguage
    );

    sgMail
      .send(verificationEmail)
      .then(() => {
        res.status(200).json({ successMessage: "Verification Email Sent" });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      "emailVerification.emailToken": req.query.token,
    });

    if (user && user.emailVerification) {
      user.emailVerification.isVerified = true;
      await user.save();
    }

    res.redirect(config.ENVIRONMENT.apiUrl + "/login?verified=true");
  } catch (error) {
    next(error);
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    try {
      if (err) {
        throw new Http500Error(err.message);
      } else if (!user) {
        throw new Http404Error(ALERTS.AUTH.ERROR.USERNAME_PASSWORD_INVALID);
      }

      if (!user.emailVerification.isVerified) {
        throw new Http400Error(ALERTS.AUTH.ERROR.EMAIL_NOT_VERIFIED);
      }

      const token = user.generateJwt();
      res.status(200).json({ token, user });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

const sendResetPasswordEmail = async (req, res, next) => {
  try {
    if (!req.params.email) {
      throw new Http400Error(ALERTS.AUTH.ERROR.EMAIL_NOT_PROVIDED);
    }

    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    user.emailVerification.emailResetPasswordToken = crypto
      .randomBytes(64)
      .toString("hex");
    await user.save();

    // Create the promise and SES service object
    const verificationLink = `http://${req.headers.host}/api/auth/verify-reset-password?token=${user.emailVerification.emailResetPasswordToken}`;
    const verificationEmail = getPasswordResetEmail(
      req.params.email,
      verificationLink,
      req.params.preferredLanguage
    );

    sgMail
      .send(verificationEmail)
      .then(() => {
        res.status(200).json({ successMessage: "Verification Email Sent" });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

const verifyPasswordReset = async (req, res, next) => {
  try {
    const user = await User.findOne({
      "emailVerification.emailResetPasswordToken": req.query.token,
    });

    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }
    res.redirect(
      `${config.ENVIRONMENT}/reset-password?token=${user.emailVerification.emailResetPasswordToken}`
    );
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    if (!req.body.token) {
      throw new Http400Error(ALERTS.AUTH.ERROR.TOKEN_NOT_PROVIDED);
    }

    if (!req.body.password) {
      throw new Http400Error(ALERTS.AUTH.ERROR.PASSWORD_NOT_PROVIDED);
    }

    const user = await User.findOne({
      "emailVerification.emailResetPasswordToken": req.body.token,
    });

    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    user.emailVerification.emailResetPasswordToken = null;
    await user.setPassword(req.body.password);
    await user.save();

    res
      .status(200)
      .json({ successMessage: ALERTS.AUTH.SUCCESS.PASSWORD_UPDATED });
  } catch (error) {
    next(error);
  }
};

const isUniqueUsername = async (req, res, next) => {
  try {
    if (!req.params.username) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
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
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
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
      throw new Http500Error(ALERTS.AUTH.ERROR.TOKEN_NOT_PROVIDED);
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
            await updateUserGithubData(
              existingGithubOAuthUser._id,
              githubUser.data,
              req.session.token,
              next
            );

            const token = existingGithubOAuthUser.generateJwt();
            return res
              .status(200)
              .json({ token, user: existingGithubOAuthUser });
          }

          const existingUserMatchingEmail = await User.findOne({
            email: githubUser.data.email,
          });

          if (existingUserMatchingEmail) {
            await updateUserGithubData(
              existingUserMatchingEmail._id,
              githubUser.data,
              req.session.token,
              next
            );

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
            ...(githubUser.data?.email && { email: githubUser.data.email }),
            username: existingUserMatchingUsername
              ? githubUser.data.login +
                (Math.floor(Math.random() * 90000) + 10000)
              : githubUser.data.login,
          });

          const experience = new Experience({ user: user._id });
          const projects = new Projects({ user: user._id });
          const education = new Education({ user: user._id });

          const roadmap = new Roadmap({
            user: user._id,
            education: education._id,
            projects: projects._id,
            experience: experience._id,
          });

          user.experience = experience._id;
          user.projects = projects._id;
          user.education = education._id;
          user.roadmap = roadmap._id;

          await education.save();
          await experience.save();
          await projects.save();
          await roadmap.save();
          await user.save();

          await updateUserGithubData(
            user._id,
            githubUser.data,
            req.session.token,
            next
          );

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

const updateGithubExistingUser = (req, res, next) => {
  try {
    if (!req.session.token) {
      throw new Http500Error(ALERTS.AUTH.ERROR.TOKEN_NOT_PROVIDED);
    }
    if (!req.params.id) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
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
            throw new Http400Error(ALERTS.AUTH.ERROR.GITHUB_USED);
          }

          const user = await User.findOne({ _id: req.params.id });

          if (!user) {
            throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
          }

          await updateUserGithubData(
            user._id,
            githubUser.data,
            req.session.token,
            next
          );

          user.github = {
            id: githubUser.data.id,
            username: githubUser.data.login,
          };
          await user.save();

          return res.status(200).json({
            user,
            successMessage: ALERTS.AUTH.SUCCESS.GITHUB_LINKED,
          });
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
  resendRegisterEmail,
  verifyEmail,
  login,
  sendResetPasswordEmail,
  verifyPasswordReset,
  resetPassword,
  isUniqueUsername,
  isUniqueEmail,
  authPage,
  getAccessToken,
  getGithubUser,
  updateGithubExistingUser,
  logout,
};
