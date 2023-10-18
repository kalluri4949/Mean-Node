const Post = require("../models/Post");
const path = require("path");
const customError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getPosts = async (req, res) => {
  // Pagination parameters from query
  const pageSize = req.query.pageSize || 10;
  const currentPage = req.query.currentPage || 1;

  // Calculate the number of documents to skip
  const documentsToSkip = (currentPage - 1) * pageSize;

  // Fetch the paginated results
  const posts = await Post.find().skip(documentsToSkip).limit(pageSize);

  // Fetch the total count of documents for pagination metadata
  const totalPosts = await Post.countDocuments();

  res.status(200).json({
    posts,
    totalPosts,
  });
};

const getSinglePost = async (req, res) => {
  const { id: postId } = req.params;
  console.log(req.userData);
  const { userId } = req.userData;
  // const post = await Post.findById({ _id: postId });
  const post = await Post.findOne({ _id: postId, createdBy: userId });
  if (!post) {
    return res.status(404).json({ msg: `No post found with this id` });
  }
  return res.status(200).json(post);
};

const createPost = async (req, res) => {
  console.log(req.files);
  if (!req.files) {
    console.log(`No file Uploaded`);
    throw new customError.BadRequestError(`No file Uploaded`);
  }

  const postImage = req.files.image;
  if (!postImage.mimetype.startsWith("image")) {
    throw new customError.BadRequestError(`Please Upload the Image`);
  }

  const maxSize = 1024 * 1024;

  if (postImage.size > maxSize) {
    throw new customError.BadRequestError(
      `Please upload image smaller than 1 MB`
    );
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${postImage.name}`
  );

  await postImage.mv(imagePath);

  req.body.imagePath = `/uploads/${postImage.name}`; // Add image path to the request body
  req.body.createdBy = req.userData.userId;
  const post = await Post.create(req.body);

  res.status(201).json({
    message: "post added successfully",
    post,
  });
};

const updatePost = async (req, res) => {
  const { id: postId } = req.params;
  const { userId } = req.userData;
  const { title, content } = req.body;
  const post = await Post.findOne({ _id: postId, createdBy: userId });
  if (!post) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: `Not authorized to edit this post` });
  }
  if (req.files && req.files.image) {
    post.imagePath = `/uploads/${req.files.image.name}`; // Update image
  }
  post.title = title;
  post.content = content;
  const savedPost = await post.save();
  res.status(200).json(savedPost);
};

const deletePost = async (req, res) => {
  const { id: postId } = req.params;
  const { userId } = req.userData;
  const post = await Post.findOne({ _id: postId, createdBy: userId });
  if (!post) {
    throw new Error("post not found with this id");
  }
  await post.deleteOne();
  return res.status(200).json({ msg: `Post removed Successfully` });
};

module.exports = {
  getPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
};
