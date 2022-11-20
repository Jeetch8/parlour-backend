const { isTokenValid } = require("../utils/jwt");
const User = require("../Models/User_Model");
const CustomError = require("../errors");

exports.checTokenAuthentication = async (req, res, next) => {
  const cookies = req.cookies;
  const userInfo = isTokenValid(cookies.token);
  if (!userInfo) {
    throw new CustomError.BadRequestError("Somthing went wrong");
  }
  const userFound = await User.findById(cookies.userId);
  // if (userFound.accountVerification !== "verified") {
  //   throw new CustomError.UnauthorizedError("User not verified");
  // }
  if (!userFound) {
    throw new CustomError.UnauthenticatedError("User unauthenticated");
  }
  next();
};

exports.checkAdminTokenAuthentication = async (req, res, next) => {
  const cookies = req.cookies;
  console.log(cookies);
  const adminInfo = isTokenValid(cookies.token);
  if (!adminInfo) {
    throw new CustomError.BadRequestError("Somthing went wrong");
  }
  const findAdmin = await User.findById(adminInfo.userId);
  if (!findAdmin) {
    throw new CustomError.UnauthenticatedError("Not authenticated");
  }
  if (findAdmin.authorization !== "FJ5vERQckWlagJm") {
    throw new CustomError.UnauthorizedError("Not authorized");
  }
  next();
};
