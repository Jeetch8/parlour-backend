const {
  adminForgotPassword,
  adminLogin,
  getAlUsers,
  deleteUser,
} = require("../Controller/Admin_Controller");

const router = require("express").Router();

router.post("/auth/forgotPassword", adminForgotPassword);
router.post("/auth/login", adminLogin);
router.get("/allusers", getAlUsers);
router.get("/deleteUser/:userId", deleteUser);

module.exports = router;
