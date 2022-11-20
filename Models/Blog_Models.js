const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    HTMLBody: {
      type: String,
      required: true,
    },
    blogImg: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    commentArray: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        commentText: { type: String },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Blog", BlogSchema);
