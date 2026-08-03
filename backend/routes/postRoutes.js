const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  likePost,
  getMyPosts,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getAllPosts);
router.get("/my-posts", protect, getMyPosts);
router.get("/:slug", getPostBySlug);
router.post("/", protect, upload.single("coverImage"), createPost);
router.put("/:id", protect, upload.single("coverImage"), updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, likePost);

module.exports = router;
