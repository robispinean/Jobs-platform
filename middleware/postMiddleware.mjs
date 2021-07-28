import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.mjs';
import Role from '../models/roleModel.mjs';

const updatePrivilege = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  const adminRole = (await Role.findOne({ name: 'admin' })).id;

  if (post) {
    if (req.user && (req.user._id.equals(post.owner) || req.user.role.equals(adminRole))) {
      next();
    } else {
      res.status(401);
      throw new Error('Must be the owner of the post');
    }
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

export default updatePrivilege;
