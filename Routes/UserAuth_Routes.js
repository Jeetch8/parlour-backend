const router = require("express").Router();

const {
  logout,
  register,
  login,
  verifyEmailforRegistration,
  forgotPassStep2,
  forgotPasswordStep1,
} = require("../Controller/Auth_Controller");
const { editProfile, getOwnProfile } = require("../Controller/User_Controller");
const { checTokenAuthentication } = require("../Middleware/authenticate");

router.get("/logout", logout);
router.post("/register", register);
router.post("/login", login);
router.get("/verifyEmail/:id", verifyEmailforRegistration);
router.post("/forgotPassword", forgotPasswordStep1);
router.post("/forgotPassword2/:id", forgotPassStep2);
router.post("/updateprofile", checTokenAuthentication, editProfile);
router.get("/getOwnProfile", checTokenAuthentication, getOwnProfile);

module.exports = router;
