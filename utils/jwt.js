const jwt = require("jsonwebtoken");

const createJWT = (user) => {
  const token = jwt.sign(user, process.env.JWT__SECRET, {
    expiresIn: process.env.JWT__EXPIRE,
  });
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT__SECRET);

module.exports = {
  createJWT,
  isTokenValid,
};
