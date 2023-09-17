const dotenv = require("dotenv").config({ path: "./.env" });

module.exports = {
  CONNECTION_URL: process.env.CONNECTION_URL,
  SECRET: process.env.SECRET,
  DBPASS: process.env.DBPASS,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
};
