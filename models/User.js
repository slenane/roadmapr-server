const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const emailRegex = /^\S+@\S+\.\S+$/;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  bio: String,
  coverImage: String,
  email: {
    type: String,
    unique: true,
    required: true,
    match: emailRegex,
  },
  emailToken: String,
  isVerified: Boolean,
  github: {
    id: String,
    username: String,
  },
  interests: {
    professional_interests: Array,
    personal_interests: Array,
  },
  languagesSpoken: [
    {
      language: {
        id: String,
        name: String,
      },
      level: {
        id: String,
        name: String,
      },
    },
  ],
  links: {
    cv: String,
    portfolio: String,
    github: String,
    twitter: String,
    linkedIn: String,
  },
  location: {
    id: String,
    name: String,
  },
  firstName: String,
  lastName: String,
  nationality: {
    id: String,
    name: String,
  },
  notifications: Boolean,
  preferredLanguage: "en" | "es" | "pt",
  previousEducation: [
    {
      school: String,
      subject: String,
      level: {
        id: String,
        name: String,
      },
    },
  ],
  profileImage: String,
  path: {
    id: Number,
    name: String,
  },
  stack: Array,
  theme: "light" | "dark",
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 2,
  },
  education: String,
  employment: String,
  projects: String,
  hash: String,
  salt: String,
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.DB_SECRET
  );
};

module.exports = mongoose.model("User", userSchema);

// const initialUser = {
//   bio: "",
//   coverImage: "",
//   email: "",
//   emailToken: "",
//   isVerified: false,
//   github: {
//     id: "",
//     username: "",
//   },
//   interests: {
//     professional_interests: [],
//     personal_interests: [],
//   },
//   languagesSpoken: [],
//   links: {
//     cv: "",
//     portfolio: "",
//     x: "",
//     linkedIn: "",
//   },
//   location: "",
//   firstName: "",
//   lastName: "",
//   nationality: "",
//   notifications: true,
//   preferredLanguage: "en",
//   previousEducation: [],
//   profileImage: "",
//   path: "",
//   stack: [],
//   theme: "dark",
//   username: "",
// };
