import asyncHandler from 'express-async-handler';
import Comment from '../models/commentModel.mjs';
import Role from '../models/roleModel.mjs';

export const updatePrivilege = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  const adminRole = (await Role.findOne({ name: 'admin' })).id;
  if (comment) {
    if (req.user && (req.user._id.equals(comment.owner) || req.user.role.equals(adminRole))) {
      next();
    } else {
      res.status(401);
      throw new Error('Must be the owner of the comment');
    }
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
});

const commentMiddleware = {
  updatePrivilege,
};