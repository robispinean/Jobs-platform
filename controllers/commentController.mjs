import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.mjs';
import Comment from '../models/commentModel.mjs';

// @desc    Create post comment
// @route   Put /api/posts/:id/comments
// @access  User
const createComment = asyncHandler(async (req, res) => {
  const { description } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    const comment = new Comment({
      owner: req.user._id,
      post: post._id,
      description,
    });

    const addedComment = await comment.save();

    await post.save();
    res.status(201);
    res.json({
      message: 'Comment added.', 
      addedComment 
    });
  } else {
    res.status(404);
    throw new Error('Post not found.');
  }
});

// @desc    Get post comments
// @route   Get /api/posts/:id/comments
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const { query } = req;
  const { limit, offset, sort } = query;

  const post = await Post.findById(req.params.id);

  if (post) {
    const comments = await Comment
        .find({ post: req.params.id }, { post: 0, __v: 0 })
        .sort({ updatedAt: (sort === 'desc') ? 'desc' : 'asc' })
        .populate({
            path: 'owner',
            select: '-password -__v',
            populate: {
                path: 'role',
                select: '-_id -__v',
            }
        });
    res.status(200);
    res.json(comments);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete post comment
// @route   DELETE /api/posts/comments/:commentId
// @access  Private/Owner/Admin
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (comment) {
    const commentId = comment._id;

    await comment.remove();
    res.json({ message: `Comment ${commentId} removed.` });
  } else {
    res.status(404);
    throw new Error('Comment not found.');
  }
});

// @desc    Update post comment
// @route   Put /api/posts/comments/:commentId
// @access  Private/Owner/Admin
const updateComment = asyncHandler(async (req, res) => {
  const {
    description,
  } = req.body;

  const comment = await Comment.findById(req.params.commentId);

  if (comment) {

    comment.description = description;

    const updatedComment = await comment.save();
    res.json({ 
        message: `Comment ${comment._id} updated`,
        updatedComment
    });
  } else {
    res.status(404);
    throw new Error('Comment not found.');
  }
});

export {
  createComment, getComments, deleteComment, updateComment,
};
