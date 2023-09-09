const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  hash: String,
  salt: String,
  coverImage: String,
  profileImage: String,
  role: String,
  bio: String,
  nationality: String,
  location: String,
  languagesSpoken: [
    {
      language: String,
      level: String,
    },
  ],
  links: {
    cv: String,
    portfolio: String,
    github: String,
    twitter: String,
    linkedIn: String,
  },
  interests: {
    professional_interests: Array,
    personal_interests: Array,
  },
  previousEducation: [
    {
      school: String,
      subject: String,
      level: String,
    },
  ],
  darkMode: Boolean,
  notifications: Boolean,
  education: String,
  employment: String,
  projects: String,
  _id: Schema.Types.ObjectId,
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
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.SECRET
  );
};

module.exports = mongoose.model("User", userSchema);
