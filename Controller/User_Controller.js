const Blog = require("../Models/Blog_Models");
const CustomError = require("../errors");
const User = require("../Models/User_Model");

exports.makeCommentOnBlog = async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params;
  const { userId } = req.cookies;
  const comment = await Blog.findByIdAndUpdate(blogId, {
    $push: { commentArray: [{ user: userId, commentText: content }] },
  });
  res.status(201).json({ success: true });
};

exports.likeBlog = async (req, res) => {
  const { blogId } = req.params;
  const { userId } = req.user;
  const findPreLike = await Blog.find({
    likes: {
      $elemMatch: { $eq: userId },
    },
  });
  if (findPreLike !== 0) {
    throw new CustomError.BadRequestError("Double liking not allowed");
  }
  const blog = await Blog.findByIdAndUpdate(blogId, {
    $push: { likes: userId },
  });
  res.status(201).json({ success: true });
};

exports.saveBlogToUser = async (req, res) => {
  const { userId } = req.cookies;
  const { blogId } = req.params;
  const user = await User.findByIdAndUpdate(userId, {
    $push: {
      savedBlogs: blogId,
    },
  });
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
