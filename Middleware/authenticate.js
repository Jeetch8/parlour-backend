const { isTokenValid } = require("../utils/jwt");
const User = require("../Models/User_Model");
const CustomError = require("../errors");

exports.checTokenAuthentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError.UnauthenticatedError("No token provided");
  }
  const token = authHeader.split(" ")[1];
  const userTokenInfo = await isTokenValid(token);
  if (!token) {
    throw new CustomError.BadRequestError("No token provided");
  }
  const userFound = await User.findById(userTokenInfo.userId);
  if (userFound.accountVerification !== "verified") {
    throw new CustomError.UnauthorizedError("User not verified");
  }
  if (!userFound) {
    throw new CustomError.UnauthenticatedError("User unauthenticated");
  }
  next();
};

exports.checkAdminTokenAuthentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError.UnauthenticatedError("No token provided");
  }
  const token = authHeader.split(" ")[1];
  const adminInfo = isTokenValid(token);
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
