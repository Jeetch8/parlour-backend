const Blog = require("../Models/Blog_Models");
const CustomError = require("../errors");
const User = require("../Models/User_Model");
const { default: mongoose } = require("mongoose");

exports.makeCommentOnBlog = async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params;
  const { userId } = req.user;
  const comment = await Blog.findByIdAndUpdate(
    blogId,
    {
      $push: { commentArray: [{ user: userId, commentText: content }] },
    },
    { new: true }
  );
  console.log(comment);
  res.status(201).json({ success: true });
};

exports.likeBlog = async (req, res) => {
  const { blogId } = req.params;
  const { userId } = req.user;
  const blog = await Blog.findByIdAndUpdate(blogId, {
    $push: { likes: userId },
  });
  res.status(201).json({ success: true });
};

exports.saveBlogToUser = async (req, res) => {
  const { userId } = req.user;
  const { blogId } = req.params;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $push: {
        savedBlogs: { blogId: `${blogId}` },
      },
    },
    { new: true }
  );
  res.status(200).json({ success: true });
};

exports.editProfile = async (req, res) => {
  const { userId } = req.cookies;
  const updateUser = await User.findByIdAndUpdate(userId, req.body);
  if (!updateUser) {
    throw new CustomError.BadRequestError(
      "Somthing went wrong, please try again"
    );
  }
  res.status(200).json({ success: true });
};

exports.getOwnProfile = async (req, res) => {
  const { userId } = req.cookies;
  const user = await User.findById(userId).select(
    "name email gender profileImg address"
  );
  res.status(200).json({ user });
};

exports.getSavedBlogs = async (req, res) => {
  const { userId } = req.user;
  // const blogs = await User.findById(userId).populate({
  //   path: "savedBlogs",
  //   populate: {
  //     path: "user",
  //     select: "name profileImg",
  //   },
  // });
  // const blogs = await User.findById(userId);
  // const blogs = await User.aggregate({

  // })
  // const blogs = await User.aggregate([
  //   { $match: { _id: mongoose.Types.ObjectId(userId) } },
  //   { $unwind: { path: "$savedBlogs" } },
  // ]);
  // blogs.populate("savedBlogs");
  const blogs = await User.findOne({ _id: userId }).populate({
    path: "savedBlogs.blogId",
  });
  res.status(200).json({ blogs });
};
