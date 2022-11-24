const Blog = require("../Models/Blog_Models");

exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  res.status(201).json({ blogs });
};

exports.getSingleBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId).populate({
    path: "commentArray",
    populate: {
      path: "user",
      select: "name profileImg",
    },
  });
  res.status(201).json({ blog });
};

exports.deleteComment = async (req, res) => {
  const { commentId, blogId } = req.body;
  console.log(commentId);
  await Blog.updateOne(
    {
      _id: blogId,
    },
    {
      $pull: {
        commentArray: {
          _id: commentId,
        },
      },
    }
  );
  res.status(200).json({ success: true });
};
