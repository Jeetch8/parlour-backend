const {
  adminForgotPassword,
  adminLogin,
  getAlUsers,
  deleteUser,
} = require("../Controller/Admin_Controller");
const { checkAdminTokenAuthentication } = require("../Middleware/authenticate");

const router = require("express").Router();

router.post("/auth/forgotPassword", adminForgotPassword);
router.post("/auth/login", adminLogin);
router.get("/allusers", checkAdminTokenAuthentication, getAlUsers);
router.get("/deleteUser/:userId", checkAdminTokenAuthentication, deleteUser);

module.exports = router;
