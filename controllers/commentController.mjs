import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.mjs';
import Comment from '../models/commentModel.mjs';

// @desc    Create post comment
// @route   Put /api/posts/:id/comments
// @access  User
const createComment = asyncHandler(async (req, res) => {
    const { description } = req.body;

    const post = await Post.findById(req.params.id);
    const userID = req.user._id;
    if (post) {
      const comment = new Comment({
        owner: userID,
        description,
      });

      const addedComment = await comment.save();

      post.comments.push(addedComment);

      await post.save();
      res.status(201);
      res.json({ message: 'Comment added.', addedComment });
    } else {
      res.status(404);
      throw new Error('Post not found.');
    }
  });

  export {
    createComment,
  };