const jwt = require("jsonwebtoken");
require("dotenv").config("../.env");

exports.jwtGenerator = username => {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "86400s" });
};
