exports.setOriginHeader = (req, res, next) => {
  // res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Origin",
    // "https://parlour-frontend.vercel.app"
    "*"
  );
  next();
};
