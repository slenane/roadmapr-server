const { expressjwt: jwt } = require("express-jwt");

const isAuth = jwt({
  secret: process.env.DB_SECRET,
  algorithms: ["HS256"],
});

module.exports = {
  isAuth,
};
