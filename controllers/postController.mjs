import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.mjs';

// @desc    Fetch all posts
// @route   GET /api/posts
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});
  res.json(posts);
});

// @desc    Fetch single post
// @route   GET /api/posts/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private/Owner/Admin
const deletePost = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id)
  let postId = post._id
  if (post) {
    await post.remove()

    res.json({ message: `Post ${postId} removed` })
  } else {
    res.status(404)
    throw new Error("Post not found")
  }
})

// @desc    Create a post
// @route   POST /api/posts
// @access  User
const createPost = asyncHandler(async (req, res) => {
  console.log(req.user._id)
  const post = new Post({
    owner: req.user._id,
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    languages: req.body.languages,
    workHour: req.body.workHour,
    workPlace: req.body.workPlace,
    comments: []
  })

  const createdPost = await post.save()
  res.status(201).json(createdPost)
})

export { getProducts, getProductById, deletePost, createPost };
