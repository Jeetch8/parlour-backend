const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  phoneNo: {
    type: Number,
  },
  gender: {
    type: String,
  },
  profileImg: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  forgotPassword: {
    type: String,
  },
  accountVerification: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  authorization: {
    type: String,
    enum: ["kiMmd7KeadhN59X", "FJ5vERQckWlagJm"],
    default: "kiMmd7KeadhN59X",
    // 1. user:kiMmd7KeadhN59X
    // 2. admin:FJ5vERQckWlagJm
  },
  savedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
});

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

UserSchema.methods.checkCryptedPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
