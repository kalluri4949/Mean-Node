const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authenticate-user");

const {
  getPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.get("/", getPosts);
router.post("/", authenticateUser, createPost);
router.get("/:id", authenticateUser, getSinglePost);
router.put("/:id", authenticateUser, updatePost);
router.delete("/:id", authenticateUser, deletePost);

module.exports = router;
