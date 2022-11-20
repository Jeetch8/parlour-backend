const {
  saveBlog,
  publishDraftedBlog,
  deleteBlog,
} = require("../Controller/Admin_Controller");
const {
  getAllBlogs,
  getSingleBlog,
  deleteComment,
} = require("../Controller/Blog_Controller");
const {
  makeCommentOnBlog,
  saveBlogToUser,
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

module.exports = router;
