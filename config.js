const dotenv = require("dotenv").config({ path: "./.env" });

module.exports = {
  DB_CONNECTION_URL: process.env.DB_CONNECTION_URL,
  DB_SECRET: process.env.DB_SECRET,
  DB_PASSWORD: process.env.DB_PASSWORD,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};
