exports.setOriginHeader = (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
};
