import asyncHandler from 'express-async-handler';
import User from '../models/userModel.mjs';
import Role from '../models/roleModel.mjs';

export const updatePrivilege = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    const adminRole = (await Role.findOne({ name: 'admin' })).id;

    if (user) {
        if (req.user && (req.user._id.equals(user._id) || req.user.role.equals(adminRole))) {
            next();
        } else {
            res.status(401);
            throw new Error('Only admins or the owner of the account can do this.');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const userMiddleware = {
    updatePrivilege,
};

export default userMiddleware;
