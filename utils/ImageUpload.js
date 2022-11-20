const CustomError = require("../errors");
const path = require("path");
const cloudinary = require("cloudinary");
const fs = require("fs");

const uploadImageLocal = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please Upload Image");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  return res.status(200).json({
    image: { src: `http://localhost:5000/uploads/${productImage.name}` },
  });
};

const uploadImageCloudinary = async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "file-upload",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(201).json({ image: { src: result.secure_url } });
};
module.exports = {
  uploadImageCloudinary,
  uploadImageLocal,
};
