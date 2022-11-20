const {
  uploadImageLocal,
  uploadImageCloudinary,
} = require("../utils/ImageUpload");

const router = require("express").Router();

router.post("/imageUploadLocal", uploadImageLocal);
router.post("/imagaeUploadCloudniary", uploadImageCloudinary);

module.exports = router;
