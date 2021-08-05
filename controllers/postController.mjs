import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.mjs';

// @desc    Fetch all posts, accepts queries
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const { query } = req;
  const {
    limit, offset, sort, type, languages, workHour, workPlace,
  } = query;
  let languagesArray = [];
  let postQuery = {};

  for (const [key] of Object.entries(query)) {
    const exp = `${key}`;

    switch (exp) {
      case 'type':
        postQuery = { ...postQuery, type };
        break;
      case 'languages': {
        languagesArray = languages.split(';');
        postQuery = { ...postQuery, languages: { $in: languagesArray } };
        break;
      }
      case 'workHour':
        postQuery = { ...postQuery, workHour };
        break;
      case 'workPlace':
        postQuery = { ...postQuery, workPlace };
        break;
    }
  }

  const posts = await Post
    .find(postQuery, { post: 0, __v: 0 })
    .populate({
      path: 'owner',
      select: '-password -__v',
      populate: {
        path: 'role',
        select: '-_id -__v',
      },
    })
    .sort({ updatedAt: (sort === 'desc') ? 'desc' : 'asc' })
    .skip(parseInt(limit, 10) * parseInt((offset - 1), 10))
    .limit(parseInt(limit, 10));

  return res.json(posts);
});

// @desc    Fetch single post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id, { post: 0, __v: 0 })
    .populate({
      path: 'owner',
      select: '-password -__v',
      populate: {
        path: 'role',
        select: '-_id -__v',
      },
    });

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found.');
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private/Owner/Admin
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    const postId = post._id;
    await post.remove();

    res.json({ message: `Post ${postId} removed.` });
  } else {
    res.status(404);
    throw new Error('Post not found.');
  }
});

// @desc    Create a post
// @route   POST /api/posts
// @access  User
const createPost = asyncHandler(async (req, res) => {
  const post = new Post({
    owner: req.user._id,
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    languages: req.body.languages,
    workHour: req.body.workHour,
    workPlace: req.body.workPlace,
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});

// @desc    Update a post
// @route   Put /api/posts/:id
// @access  Private/Owner/Admin
const updatePost = asyncHandler(async (req, res) => {
  const {
    type, title, description, languages, workHour, workPlace,
  } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    post.type = type;
    post.title = title;
    post.description = description;
    post.languages = languages;
    post.workHour = workHour;
    post.workPlace = workPlace;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found.');
  }
});

export {
  getPosts, getPostById, deletePost, createPost, updatePost,
};
