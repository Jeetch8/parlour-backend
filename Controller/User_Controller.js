const Blog = require("../Models/Blog_Models");
const CustomError = require("../errors");
const User = require("../Models/User_Model");

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

exports.getSavedBlogs = async (req, res) => {
  const { userId } = req.user;
  const blogs = await User.findById(userId);
  res.status(200).json({ savedBlogs: blogs });
};
