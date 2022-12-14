const {
  saveBlog,
  publishDraftedBlog,
  deleteBlog,
} = require("../Controller/Admin_Controller");
const {
  getAllBlogs,
  getSingleBlog,
  deleteComment,
  editBlog,
} = require("../Controller/Blog_Controller");
const {
  makeCommentOnBlog,
  saveBlogToUser,
  likeBlog,
  getSavedBlogs,
} = require("../Controller/User_Controller");
const {
  checkAdminTokenAuthentication,
  checTokenAuthentication,
} = require("../Middleware/authenticate");

const router = require("express").Router();

router.get("/", getAllBlogs);
router.get("/blog/:blogId", getSingleBlog);
checTokenAuthentication,
  router.get(
    "/saveBlogForUser/:blogId",
    checTokenAuthentication,
    saveBlogToUser
  );
router.post("/saveBlog", checkAdminTokenAuthentication, saveBlog);
router.get(
  "/publishDraftedBlog/:blogId",
  checkAdminTokenAuthentication,
  publishDraftedBlog
);
router.post("/blogComment/:blogId", checTokenAuthentication, makeCommentOnBlog);
router.delete("/deleteBlog/:blogId", checkAdminTokenAuthentication, deleteBlog);
router.post("/deleteComment", checkAdminTokenAuthentication, deleteComment);
router.get("/likePost/:blogId", checTokenAuthentication, likeBlog);
router.get("/savedblogs", checTokenAuthentication, getSavedBlogs);
router.post("/editblog/:blogId", checkAdminTokenAuthentication, editBlog);

module.exports = router;
