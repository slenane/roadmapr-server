require("dotenv").config({ path: "./.env" });

module.exports = {
  DB_CONNECTION_URL: process.env.DB_CONNECTION_URL,
  DB_SECRET: process.env.DB_SECRET,
  DB_PASSWORD: process.env.DB_PASSWORD,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_ACCESS_KEY_SECRET: process.env.AWS_ACCESS_KEY_SECRET,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
};
