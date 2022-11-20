const {
  uploadImageLocal,
  uploadImageCloudinary,
} = require("../utils/ImageUpload");

const router = require("express").Router();

router.post("/imageUploadLocal", uploadImageLocal);
// router.post("/imageUploadLocal", uploadImageLocal);
router.post("/imagaeUploadCloudniary", uploadImageLocal);

module.exports = router;
