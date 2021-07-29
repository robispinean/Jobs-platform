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

// @desc    Get post comments
// @route   Get /api/posts/:id/comments
// @access  Public
const getComments = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate("comments");

    if (post) {
        const comments = post.comments;
        comments.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        })
        res.status(200);
        res.json(comments);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Delete post comment
// @route   Get /api/posts/:postId/comments/:commentId
// @access  Private/Owner/Admin
const deleteComment = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    const comment = await Comment.findById(req.params.commentId)

    if (comment) {
        const commentId = comment._id

        if(post){
            let index = post.comments.indexOf(commentId)

            if (index > -1) {
                post.comments.splice(index, 1);

                await post.save();
                console.log(post.comments)
              }
        }else{ 
            res.status(404);
            throw new Error('Post not found.');
        }

        await comment.remove();
        res.json({ message: `Comment ${commentId} removed.` });
    } else {
        res.status(404);
        throw new Error('Comment not found.');
    }
});

export {
    createComment, getComments, deleteComment
};