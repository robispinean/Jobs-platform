import Post from '../models/postModel.mjs'
import asyncHandler from 'express-async-handler'

const updatePrivilege = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id)

    if (req.user && (req.user._id.equals(post.owner) || req.user.role.name === 'admin')) {
        next()
    } else {
        res.status(401)
        throw new Error("Must be the owner of the post")
    }
})

export { updatePrivilege }